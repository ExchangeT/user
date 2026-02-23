import { NextResponse } from 'next/server';
import { ethers } from 'ethers';
import ERC2771ForwarderABI from '@/lib/contracts/ERC2771Forwarder.json';

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // EIP-2771 ForwardRequestData structure from OpenZeppelin 5.x
        // signature is part of the request struct in OpenZeppelin's ERC2771Forwarder `execute(ForwardRequestData)`
        const { request } = body;

        const ALLOWED_TARGETS = [
            process.env.NEXT_PUBLIC_CRIC_MARKET_ADDRESS?.toLowerCase(),
        ].filter(Boolean);

        if (!ALLOWED_TARGETS.includes(request.to?.toLowerCase())) {
            console.warn(`[RELAYER] Unauthorized target: ${request.to}`);
            return NextResponse.json({ success: false, error: 'Unauthorized target contract.' }, { status: 403 });
        }

        console.log(`[RELAYER] Received meta-transaction request from ${request.from} targeting ${request.to}`);

        const RPC_URL = process.env.NEXT_PUBLIC_WEB3_RPC_URL || 'http://127.0.0.1:8545';
        const FORWARDER_ADDRESS = process.env.NEXT_PUBLIC_FORWARDER_ADDRESS;

        if (!FORWARDER_ADDRESS) {
            console.error('[RELAYER] NEXT_PUBLIC_FORWARDER_ADDRESS is missing from env.');
            return NextResponse.json({ success: false, error: 'Forwarder not configured' }, { status: 500 });
        }

        const provider = new ethers.JsonRpcProvider(RPC_URL);

        // Use the Admin/Oracle Wallet via Secure Vault
        const { vault } = await import('@/lib/vault');
        const wallet = await vault.getOracleWallet(provider);

        const forwarder = new ethers.Contract(FORWARDER_ADDRESS, ERC2771ForwarderABI.abi, wallet);

        // Optional: Verify the request off-chain strictly before sending
        // Even though execute() handles verification, checking here provides better error messages.
        try {
            const isValid = await forwarder.verify(request);
            if (!isValid) {
                console.error(`[RELAYER] Signature verification failed for ${request.from}`);
                return NextResponse.json({ success: false, error: 'Signature verification failed or request expired' }, { status: 400 });
            }
        } catch (verifyErr: any) {
            console.error(`[RELAYER] Verify call reverted:`, verifyErr.shortMessage || verifyErr.message);
            return NextResponse.json({ success: false, error: 'Verification error: ' + (verifyErr.shortMessage || verifyErr.message) }, { status: 400 });
        }

        console.log(`[RELAYER] Signature valid. Broadcasting transaction to network paying gas...`);

        // Execute the gasless meta-transaction
        const tx = await forwarder.execute(request);

        console.log(`[RELAYER] Transaction broadcast! Hash: ${tx.hash}`);
        const receipt = await tx.wait(); // Wait for 1 confirmation

        console.log(`[RELAYER] Execution successful. Gas used: ${receipt.gasUsed.toString()}`);

        return NextResponse.json({ success: true, txHash: tx.hash });

    } catch (error: any) {
        console.error('[RELAYER ERROR]', error);
        return NextResponse.json({ success: false, error: 'Relay failed: ' + (error.shortMessage || error.message) }, { status: 500 });
    }
}
