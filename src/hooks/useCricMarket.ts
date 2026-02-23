import { useState } from 'react';
import { useReadContract, useAccount, useSignTypedData, useChainId } from 'wagmi';
import { parseUnits, encodeFunctionData } from 'viem';
import CricMarketABI from '@/lib/contracts/CricMarket.json';
import CricTokenABI from '@/lib/contracts/CricToken.json';
import ERC2771ForwarderABI from '@/lib/contracts/ERC2771Forwarder.json';

const MARKET_ADDRESS = process.env.NEXT_PUBLIC_CRIC_MARKET_ADDRESS as `0x${string}`;
const TOKEN_ADDRESS = process.env.NEXT_PUBLIC_CRIC_TOKEN_ADDRESS as `0x${string}`;
const FORWARDER_ADDRESS = process.env.NEXT_PUBLIC_FORWARDER_ADDRESS as `0x${string}`;

export function useCricMarket(marketId: string) {
    const { address } = useAccount();
    const chainId = useChainId();
    const { signTypedDataAsync } = useSignTypedData();

    // Local loading state to match the old useWriteContract `isPending`
    const [isWriting, setIsWriting] = useState(false);

    // =============== READ STATE ===============

    // 1. Get overall market stats
    const { data: marketInfo, refetch: refetchMarket } = useReadContract({
        address: MARKET_ADDRESS,
        abi: CricMarketABI.abi,
        functionName: 'getMarketInfo',
        args: [marketId],
    });

    // 2. Get user's active prediction for this market
    const { data: userPrediction, refetch: refetchUserPred } = useReadContract({
        address: MARKET_ADDRESS,
        abi: CricMarketABI.abi,
        functionName: 'getUserPrediction',
        args: [marketId, address || '0x0000000000000000000000000000000000000000'],
        query: { enabled: !!address }
    });

    // 3. Get User's Nonce from the Forwarder for Meta-Tx
    const { data: forwarderNonce, refetch: refetchNonce } = useReadContract({
        address: FORWARDER_ADDRESS,
        abi: ERC2771ForwarderABI.abi,
        functionName: 'nonces',
        args: [address || '0x0000000000000000000000000000000000000000'],
        query: { enabled: !!address }
    });

    // =============== WRITE STATE (GASLESS VIA RELAYER) ===============

    const signAndRelay = async (targetAddress: `0x${string}`, calldata: `0x${string}`) => {
        if (!address) throw new Error("Wallet not fully connected");
        if (forwarderNonce === undefined) throw new Error("Forwarder nonce not loaded");
        if (!FORWARDER_ADDRESS) throw new Error("Forwarder address missing in env");

        setIsWriting(true);
        try {
            const nonce = BigInt((forwarderNonce as bigint).toString());
            const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour validity

            const request = {
                from: address,
                to: targetAddress,
                value: BigInt(0),
                gas: BigInt(500000), // default sufficient gas
                nonce: nonce,
                deadline: deadline,
                data: calldata
            };

            // 1. User signs the EIP-712 structured data (0 gas cost)
            const signature = await signTypedDataAsync({
                domain: {
                    name: 'CricChainForwarder',
                    version: '1',
                    chainId: chainId,
                    verifyingContract: FORWARDER_ADDRESS
                },
                types: {
                    ForwardRequest: [
                        { name: 'from', type: 'address' },
                        { name: 'to', type: 'address' },
                        { name: 'value', type: 'uint256' },
                        { name: 'gas', type: 'uint256' },
                        { name: 'nonce', type: 'uint256' },
                        { name: 'deadline', type: 'uint48' },
                        { name: 'data', type: 'bytes' }
                    ]
                },
                primaryType: 'ForwardRequest',
                message: request
            });

            // 2. Prep JSON payload (convert BigInts to Strings) for API
            const payload = {
                ...request,
                signature,
                value: request.value.toString(),
                gas: request.gas.toString(),
                nonce: request.nonce.toString(),
                deadline: request.deadline.toString()
            };

            // 3. Send signature to backend Relayer
            const res = await fetch('/api/relayer/forward', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ request: payload })
            });

            const data = await res.json();
            if (!data.success) throw new Error(data.error);

            refetchNonce(); // Prep for next tx
            return data.txHash;

        } finally {
            setIsWriting(false);
        }
    };

    // 1. Approve Tokens (Gasless!)
    const approveTokens = async (amount: string) => {
        const parsedAmount = parseUnits(amount, 18);
        const calldata = encodeFunctionData({
            abi: CricTokenABI.abi,
            functionName: 'approve',
            args: [MARKET_ADDRESS, parsedAmount]
        });
        return await signAndRelay(TOKEN_ADDRESS, calldata);
    };

    // 2. Place Prediction (Gasless!)
    const placePrediction = async (outcomeId: string, amount: string) => {
        const parsedAmount = parseUnits(amount, 18);
        const calldata = encodeFunctionData({
            abi: CricMarketABI.abi,
            functionName: 'placePrediction',
            args: [marketId, outcomeId, parsedAmount]
        });
        return await signAndRelay(MARKET_ADDRESS, calldata);
    };

    // 3. Claim Winnings (Gasless!)
    const claimWinnings = async () => {
        const calldata = encodeFunctionData({
            abi: CricMarketABI.abi,
            functionName: 'claimWinnings',
            args: [marketId]
        });
        return await signAndRelay(MARKET_ADDRESS, calldata);
    };

    const refetchAll = () => {
        refetchMarket();
        refetchUserPred();
        refetchNonce();
    };

    return {
        marketInfo,
        userPrediction,
        refetchAll,
        approveTokens,
        placePrediction,
        claimWinnings,
        isWriting,
        MARKET_ADDRESS,
        TOKEN_ADDRESS
    };
}
