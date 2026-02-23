import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import db from '@/lib/db';

export async function POST(req: Request) {
    try {
        const payload = await req.json();
        const headersList = await headers();

        // 1. Authenticate the Indexer (e.g., Alchemy Webhook Signature)
        const expectedSignature = process.env.CRYPTO_WEBHOOK_SECRET;
        const incomingSignature = headersList.get('x-alchemy-signature'); // Assume Alchemy for now

        if (expectedSignature && incomingSignature !== expectedSignature) {
            console.error('⚠️ Invalid Crypto Webhook Signature');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 2. Parse payload based on Indexer format
        const { event, hash, from, amount, symbol, chainId, contractAddress } = payload;

        if (event !== 'TRANSFER') {
            return NextResponse.json({ message: 'Ignored non-transfer event' });
        }

        if (!from || !hash || typeof amount !== 'number') {
            return NextResponse.json({ error: 'Malformed webhook payload' }, { status: 400 });
        }

        console.log(`[CRYPTO WEBHOOK] Detected ${amount} ${symbol} transfer from ${from} (Tx: ${hash})`);

        // 3. Prevent Double Crediting (Idempotency check on txHash)
        const existingTx = await db.transaction.findFirst({
            where: { txHash: hash }
        });

        if (existingTx) {
            console.warn(`[CRYPTO WEBHOOK] Transaction ${hash} already processed.`);
            return NextResponse.json({ message: 'Transaction already processed' });
        }

        // 4. Resolve the User from the 'from' address (via DepositAddress model)
        const depositAddress = await (db as any).depositAddress.findFirst({
            where: {
                address: { equals: from, mode: 'insensitive' },
                chainId: chainId || 'polygon' // Default to polygon if not specified
            },
            include: { user: { include: { wallet: true } } }
        });

        const user = depositAddress?.user;

        if (!user || !user.wallet) {
            console.error(`[CRYPTO WEBHOOK] Unbound address ${from}. Cannot credit deposit.`);
            // In a full production system, you might create an "Orphaned Deposit" table here
            return NextResponse.json({ error: 'Sender address not linked to any user' }, { status: 404 });
        }

        // 5. Atomically Credit Wallet
        await db.$transaction(async (tx) => {
            // A. Update aggregate USD equivalent balance
            await tx.wallet.update({
                where: { id: user.wallet!.id },
                data: {
                    availableBalance: { increment: amount },
                    totalBalance: { increment: amount }
                }
            });

            // B. Update specific ERC20 token balance row
            const tokenBalance = await tx.walletBalance.findUnique({
                where: { walletId_currency: { walletId: user.wallet!.id, currency: symbol || 'USDT' } }
            });

            if (tokenBalance) {
                await tx.walletBalance.update({
                    where: { id: tokenBalance.id },
                    data: { balance: { increment: amount } }
                });
            } else {
                await tx.walletBalance.create({
                    data: {
                        walletId: user.wallet!.id,
                        currency: symbol || 'USDT',
                        balance: amount,
                        lockedBalance: 0
                    }
                });
            }

            // C. Log the DEPOSIT
            await tx.transaction.create({
                data: {
                    userId: user.id,
                    type: 'DEPOSIT',
                    currency: symbol || 'USDT',
                    amount: amount,
                    status: 'COMPLETED',
                    txHash: hash,
                    description: 'crypto_onchain_deposit',
                    metadata: {
                        fromAddress: from,
                        contractAddress: contractAddress || 'native'
                    }
                }
            });
        });

        console.log(`✅ [CRYPTO WEBHOOK] Successfully credited ${amount} ${symbol} to User ${user.email}`);
        return NextResponse.json({ success: true, message: 'Deposit processed' });

    } catch (error: any) {
        console.error('Crypto Webhook Execution Error:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Internal webhook error'
        }, { status: 500 });
    }
}
