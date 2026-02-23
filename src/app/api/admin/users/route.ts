import { NextRequest } from 'next/server';
import db from '@/lib/db';
import { requireAdmin, apiSuccess, apiError, apiPaginated } from '@/lib/api-utils';

// GET /api/admin/users — List all users
export async function GET(req: NextRequest) {
    const { error } = await requireAdmin();
    if (error) return error;

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const search = searchParams.get('search');

    const where: any = {};
    if (search) {
        where.OR = [
            { email: { contains: search, mode: 'insensitive' } },
            { username: { contains: search, mode: 'insensitive' } },
            { walletAddress: { contains: search, mode: 'insensitive' } },
        ];
    }

    const [users, total] = await Promise.all([
        db.user.findMany({
            where,
            select: {
                id: true, email: true, username: true, walletAddress: true,
                role: true, tier: true, isActive: true, createdAt: true,
                totalPredictions: true, wins: true, losses: true, totalWinnings: true, netProfit: true,
                wallet: { select: { totalBalance: true, availableBalance: true } },
                _count: { select: { referralsMade: true } },
            },
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * pageSize,
            take: pageSize,
        }),
        db.user.count({ where }),
    ]);

    return apiPaginated(users, total, page, pageSize);
}
