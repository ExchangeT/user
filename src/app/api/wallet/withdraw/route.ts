import { Prisma } from '@prisma/client';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import db from '@/lib/db';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !(session.user as any)?.id) {
            return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401 });
        }

        const body = await req.json();
        const { amount, currency = 'USDT', destinationAddress } = body;

        const amountDec = new Prisma.Decimal(amount);
        if (amountDec.isNaN() || amountDec.lte(0)) {
            return NextResponse.json({ success: false, error: 'Invalid withdrawal amount' }, { status: 400 });
        }

        if (!destinationAddress) {
            return NextResponse.json({ success: false, error: 'Destination address is required' }, { status: 400 });
        }

        const result = await db.$transaction(async (tx) => {
            const user = await tx.user.findUnique({
                where: { id: (session.user as any).id },
                include: { wallet: true }
            });

            if (!user) {
                throw new Error("User not found.");
            }

            const userWallet = user.wallet;

            if (!userWallet) {
                throw new Error("Wallet not found.");
            }

            const usdtBalance = await tx.walletBalance.findUnique({
                where: {
                    walletId_currency: {
                        walletId: userWallet.id,
                        currency: currency
                    }
                }
            });

            const currentBalance = usdtBalance ? new Prisma.Decimal(usdtBalance.balance as any) : new Prisma.Decimal(0);

            if (currentBalance.lt(amountDec)) {
                throw new Error("Insufficient funds available for withdrawal.");
            }

            // 2. Lock the funds for withdrawal
            // Decrement the available balance and increment lockedBalance
            await tx.walletBalance.update({
                where: { id: usdtBalance!.id },
                data: {
                    balance: { decrement: amountDec as any },
                    lockedBalance: { increment: amountDec as any }
                }
            });

            // 3. Update master wallet available balance (totals)
            await tx.wallet.update({
                where: { id: userWallet.id },
                data: {
                    availableBalance: { decrement: amountDec as any }
                }
            });

            // 4. Create PENDING Withdrawal Request Ledger Entry
            const transaction = await tx.transaction.create({
                data: {
                    userId: (session.user as any).id,
                    type: 'WITHDRAWAL',
                    amount: amountDec as any,
                    netAmount: amountDec as any,
                    currency: currency,
                    status: 'PENDING',
                    description: `Withdrawal request of ${amountDec.toString()} ${currency}`,
                    metadata: {
                        destinationAddress
                    }
                }
            });

            return transaction;
        });

        return NextResponse.json({
            success: true,
            message: `Withdrawal request for ${amountDec.toString()} ${currency} submitted successfully.`,
            data: result
        });

    } catch (error: any) {
        console.error('Withdrawal Request Error:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'An internal error occurred submitting your withdrawal request.'
        }, { status: 500 });
    }
}
