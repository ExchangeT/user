import { NextRequest } from 'next/server';
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils';
import db from '@/lib/db';

// GET /api/auth/me — Get current authenticated user
export async function GET() {
    const { error, user } = await requireAuth();
    if (error) return error;

    const wallet = await db.wallet.findUnique({
        where: { userId: user!.id },
        include: { balances: true },
    });

    return apiSuccess({
        id: user!.id,
        email: user!.email,
        username: user!.username,
        name: user!.name,
        image: user!.image,
        walletAddress: user!.walletAddress,
        role: user!.role,
        tier: user!.tier,
        referralCode: user!.referralCode,
        isActive: user!.isActive,
        createdAt: user!.createdAt,
        stats: {
            totalPredictions: user!.totalPredictions,
            wins: user!.wins,
            losses: user!.losses,
            winRate: user!.totalPredictions > 0 ? (user!.wins / user!.totalPredictions) * 100 : 0,
            totalWinnings: user!.totalWinnings,
            netProfit: user!.netProfit,
            currentStreak: user!.currentStreak,
            bestStreak: user!.bestStreak,
        },
        wallet: wallet ? {
            totalBalance: wallet.totalBalance,
            lockedBalance: wallet.lockedBalance,
            availableBalance: wallet.availableBalance,
            balances: wallet.balances.map((b) => ({
                currency: b.currency,
                balance: b.balance,
                lockedBalance: b.lockedBalance,
            })),
        } : null,
    });
}
