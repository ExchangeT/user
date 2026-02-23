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
        const { amount, currency = 'USDT' } = body;

        const amountDec = new Prisma.Decimal(amount);
        if (amountDec.isNaN() || amountDec.lte(0)) {
            return NextResponse.json({ success: false, error: 'Invalid deposit amount' }, { status: 400 });
        }

        // Atomically process the deposit
        const result = await db.$transaction(async (tx) => {
            // 1. Get or Create Wallet
            let userWallet = await tx.wallet.findUnique({
                where: { userId: (session.user as any).id },
                include: { balances: true }
            });

            if (!userWallet) {
                userWallet = await tx.wallet.create({
                    data: {
                        userId: (session.user as any).id,
                        availableBalance: new Prisma.Decimal(0) as any,
                        totalBalance: new Prisma.Decimal(0) as any,
                    },
                    include: { balances: true }
                });
            }

            // 2. Fetch Currency Balance
            let currencyBalance = await tx.walletBalance.findUnique({
                where: {
                    walletId_currency: {
                        walletId: userWallet.id,
                        currency: currency
                    }
                }
            });

            // 3. Update Balance
            if (currencyBalance) {
                await tx.walletBalance.update({
                    where: { id: currencyBalance.id },
                    data: { balance: { increment: amountDec as any } }
                });
            } else {
                await tx.walletBalance.create({
                    data: {
                        walletId: userWallet.id,
                        currency: currency,
                        balance: amountDec as any
                    }
                });
            }

            // 4. Update Master Wallet
            await tx.wallet.update({
                where: { id: userWallet.id },
                data: {
                    availableBalance: { increment: amountDec as any },
                    totalBalance: { increment: amountDec as any }
                }
            });

            // 5. Log DEPOSIT Transaction
            const transaction = await tx.transaction.create({
                data: {
                    userId: (session.user as any).id,
                    type: 'DEPOSIT',
                    amount: amountDec as any,
                    netAmount: amountDec as any,
                    currency: currency,
                    status: 'COMPLETED',
                    description: `Simulated deposit of ${amountDec.toString()} ${currency}`
                }
            });

            return transaction;
        });

        return NextResponse.json({
            success: true,
            message: `Successfully deposited ${amountDec.toString()} ${currency}`,
            data: result
        });

    } catch (error: any) {
        console.error('Deposit Error:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'An internal error occurred during deposit'
        }, { status: 500 });
    }
}
