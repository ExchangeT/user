import { NextRequest } from 'next/server';
import db from '@/lib/db';
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils';

// GET /api/wallet — User's wallet
export async function GET() {
    const { error, user } = await requireAuth();
    if (error) return error;

    const wallet = await db.wallet.findUnique({
        where: { userId: user!.id },
        include: { balances: true },
    });

    if (!wallet) return apiError('Wallet not found', 404);

    return apiSuccess({
        totalBalance: wallet.totalBalance,
        lockedBalance: wallet.lockedBalance,
        availableBalance: wallet.availableBalance,
        balances: wallet.balances,
    });
}
