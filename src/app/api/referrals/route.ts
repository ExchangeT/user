import { NextRequest } from 'next/server';
import { Prisma } from '@prisma/client';
import db from '@/lib/db';
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils';

// GET /api/referrals — User's referral network + stats + rewards
export async function GET(req: NextRequest) {
    const { error, user } = await requireAuth();
    if (error) return error;

    const { searchParams } = new URL(req.url);
    const view = searchParams.get('view') || 'stats';

    if (view === 'stats') {
        const referrals = await db.referral.findMany({
            where: { referrerId: user!.id },
            include: { referee: { select: { id: true, username: true, image: true, totalPredictions: true } } },
        });

        const l1 = referrals.filter((r: { level: number }) => r.level === 1);
        const l2 = referrals.filter((r: { level: number }) => r.level === 2);
        const l3 = referrals.filter((r: { level: number }) => r.level === 3);

        const totalRewards = await db.referralReward.aggregate({
            where: { referral: { referrerId: user!.id } },
            _sum: { rewardAmount: true },
        });

        return apiSuccess({
            totalReferrals: referrals.length,
            level1Count: l1.length,
            level2Count: l2.length,
            level3Count: l3.length,
            totalEarnings: referrals.reduce((s, r) => s.plus(new Prisma.Decimal(r.totalEarned as any)), new Prisma.Decimal(0)).toNumber(),
            level1Earnings: l1.reduce((s, r) => s.plus(new Prisma.Decimal(r.totalEarned as any)), new Prisma.Decimal(0)).toNumber(),
            level2Earnings: l2.reduce((s, r) => s.plus(new Prisma.Decimal(r.totalEarned as any)), new Prisma.Decimal(0)).toNumber(),
            level3Earnings: l3.reduce((s, r) => s.plus(new Prisma.Decimal(r.totalEarned as any)), new Prisma.Decimal(0)).toNumber(),
            totalInstantRewards: (totalRewards._sum.rewardAmount as any)?.toNumber() ?? 0,
            referralCode: user!.referralCode,
        });
    }

    if (view === 'network') {
        const level = parseInt(searchParams.get('level') || '0');
        const where: Record<string, unknown> = { referrerId: user!.id };
        if (level > 0) where.level = level;

        const referrals = await db.referral.findMany({
            where,
            include: {
                referee: {
                    select: { id: true, username: true, image: true, totalPredictions: true, tier: true, createdAt: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return apiSuccess(referrals);
    }

    if (view === 'rewards') {
        const rewards = await db.referralReward.findMany({
            where: { referral: { referrerId: user!.id } },
            include: {
                prediction: {
                    include: { match: { include: { team1: true, team2: true } }, outcome: true },
                },
                referral: {
                    include: { referee: { select: { username: true, image: true } } },
                },
            },
            orderBy: { createdAt: 'desc' },
            take: 50,
        });

        return apiSuccess(rewards);
    }

    return apiError('Invalid view parameter', 400);
}
