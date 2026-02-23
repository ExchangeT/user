import { NextRequest } from 'next/server';
import db from '@/lib/db';
import { apiSuccess, apiError, apiPaginated, requireAdmin } from '@/lib/api-utils';
import { createMarketSchema } from '@/lib/validators';

// GET /api/markets — List markets
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const matchId = searchParams.get('matchId');
        const status = searchParams.get('status')?.toUpperCase();
        const page = parseInt(searchParams.get('page') || '1');
        const pageSize = parseInt(searchParams.get('pageSize') || '20');

        const where: any = {};
        if (matchId) where.matchId = matchId;
        if (status) where.status = status;

        const [markets, total] = await Promise.all([
            db.market.findMany({
                where,
                include: {
                    outcomes: true,
                    match: { include: { team1: true, team2: true, tournament: true } },
                },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * pageSize,
                take: pageSize,
            }),
            db.market.count({ where }),
        ]);

        return apiPaginated(markets, total, page, pageSize);
    } catch (error) {
        console.error('Markets list error:', error);
        return apiError('Failed to fetch markets', 500);
    }
}

// POST /api/markets — Admin: Create market with outcomes
export async function POST(req: NextRequest) {
    try {
        const { error: authError } = await requireAdmin();
        if (authError) return authError;

        const body = await req.json();
        const parsed = createMarketSchema.safeParse(body);
        if (!parsed.success) return apiError(parsed.error.message, 422);

        const { matchId, type, question, outcomes, openTime, closeTime, platformFeePercent } = parsed.data;

        // Verify match exists
        const match = await db.match.findUnique({ where: { id: matchId } });
        if (!match) return apiError('Match not found', 404);

        const market = await db.market.create({
            data: {
                matchId,
                type,
                question,
                openTime: new Date(openTime),
                closeTime: new Date(closeTime),
                platformFeePercent: platformFeePercent ?? 2.0,
                outcomes: {
                    create: outcomes.map((o) => ({
                        name: o.name,
                        odds: o.odds,
                        probability: o.probability,
                    })),
                },
            },
            include: { outcomes: true },
        });

        return apiSuccess(market, 201);
    } catch (error) {
        console.error('Create market error:', error);
        return apiError('Failed to create market', 500);
    }
}
