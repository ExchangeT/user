import { NextRequest } from 'next/server';
import db from '@/lib/db';
import { requireAdmin, apiSuccess, apiError } from '@/lib/api-utils';

// POST /api/admin/transactions/[id]/approve — Approve pending withdrawal
export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { error } = await requireAdmin();
    if (error) return error;

    const { id } = await params;
    const transaction = await db.transaction.findUnique({ where: { id } });
    if (!transaction) return apiError('Transaction not found', 404);
    if (transaction.type !== 'WITHDRAWAL') return apiError('Not a withdrawal', 400);
    if (transaction.status !== 'PENDING') return apiError('Transaction not pending', 400);

    await db.$transaction(async (tx: Omit<typeof db, '$connect' | '$disconnect' | '$on' | '$transaction' | '$extends'>) => {
        await tx.transaction.update({
            where: { id },
            data: { status: 'COMPLETED', completedAt: new Date() },
        });

        await tx.wallet.update({
            where: { userId: transaction.userId },
            data: { totalBalance: { decrement: transaction.amount }, lockedBalance: { decrement: transaction.amount } },
        });

        await tx.walletBalance.updateMany({
            where: { wallet: { userId: transaction.userId }, currency: transaction.currency },
            data: { lockedBalance: { decrement: transaction.amount } },
        });

        await tx.notification.create({
            data: {
                userId: transaction.userId, type: 'wallet', icon: '✅',
                title: 'Withdrawal Approved',
                description: `Your ${transaction.currency} ${transaction.netAmount.toFixed(2)} withdrawal has been processed`,
            },
        });
    });

    return apiSuccess({ message: 'Withdrawal approved' });
}
