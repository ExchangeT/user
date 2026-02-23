import { NextRequest } from 'next/server';
import db from '@/lib/db';
import { requireAdmin, apiSuccess, apiError } from '@/lib/api-utils';

// GET /api/admin/dashboard — Admin dashboard KPIs
export async function GET() {
    const { error } = await requireAdmin();
    if (error) return error;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
        totalUsers,
        newUsersToday,
        newUsersMonth,
        totalPredictions,
        predictionsToday,
        totalVolume,
        volumeToday,
        pendingWithdrawals,
        totalRevenue,
        activeMatches,
        openMarkets,
    ] = await Promise.all([
        db.user.count(),
        db.user.count({ where: { createdAt: { gte: today } } }),
        db.user.count({ where: { createdAt: { gte: thisMonth } } }),
        db.prediction.count(),
        db.prediction.count({ where: { placedAt: { gte: today } } }),
        db.prediction.aggregate({ _sum: { amount: true } }),
        db.prediction.aggregate({ where: { placedAt: { gte: today } }, _sum: { amount: true } }),
        db.transaction.count({ where: { type: 'WITHDRAWAL', status: 'PENDING' } }),
        db.transaction.aggregate({ where: { type: 'FEE', status: 'COMPLETED' }, _sum: { amount: true } }),
        db.match.count({ where: { status: 'LIVE' } }),
        db.market.count({ where: { status: { in: ['OPEN', 'LIVE'] } } }),
    ]);

    // Recent activity
    const recentTransactions = await db.transaction.findMany({
        include: { user: { select: { username: true, image: true } } },
        orderBy: { createdAt: 'desc' },
        take: 10,
    });

    return apiSuccess({
        kpis: {
            totalUsers,
            newUsersToday,
            newUsersMonth,
            totalPredictions,
            predictionsToday,
            totalVolume: totalVolume._sum.amount ?? 0,
            volumeToday: volumeToday._sum.amount ?? 0,
            pendingWithdrawals,
            totalRevenue: totalRevenue._sum.amount ?? 0,
            activeMatches,
            openMarkets,
        },
        recentActivity: recentTransactions,
    });
}
