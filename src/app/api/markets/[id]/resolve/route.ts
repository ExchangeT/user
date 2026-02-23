import { NextRequest } from 'next/server';
import db from '@/lib/db';
import { apiSuccess, apiError, requireAdmin } from '@/lib/api-utils';
import { resolveMarketSchema } from '@/lib/validators';

// POST /api/markets/[id]/resolve — Admin: Resolve market and settle all predictions
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { error: authError } = await requireAdmin();
        if (authError) return authError;

        const { id } = await params;
        const body = await req.json();
        const parsed = resolveMarketSchema.safeParse(body);
        if (!parsed.success) return apiError(parsed.error.message, 422);

        const { outcomeId } = parsed.data;

        const market = await db.market.findUnique({
            where: { id },
            include: { outcomes: true, predictions: true },
        });

        if (!market) return apiError('Market not found', 404);
        if (market.status === 'SETTLED') return apiError('Market already settled', 400);

        const winningOutcome = market.outcomes.find((o: { id: string }) => o.id === outcomeId);
        if (!winningOutcome) return apiError('Invalid outcome for this market', 400);

        await db.$transaction(async (tx: Omit<typeof db, '$connect' | '$disconnect' | '$on' | '$transaction' | '$extends'>) => {
            await tx.market.update({
                where: { id },
                data: { status: 'SETTLED', resolvedOutcomeId: outcomeId, resolvedAt: new Date() },
            });

            for (const prediction of market.predictions) {
                const isWinner = prediction.outcomeId === outcomeId;
                const predictionAmount = Number(prediction.amount);
                const predictionOdds = Number(prediction.oddsAtPrediction);
                const payout = isWinner ? predictionAmount * predictionOdds : 0;

                await tx.prediction.update({
                    where: { id: prediction.id },
                    data: { status: isWinner ? 'WON' : 'LOST', actualPayout: payout, settledAt: new Date() },
                });

                if (isWinner && payout > 0) {
                    await tx.wallet.update({
                        where: { userId: prediction.userId },
                        data: { totalBalance: { increment: payout }, availableBalance: { increment: payout } },
                    });
                    await tx.walletBalance.updateMany({
                        where: { wallet: { userId: prediction.userId }, currency: 'USDT' },
                        data: { balance: { increment: payout } },
                    });
                    await tx.transaction.create({
                        data: {
                            userId: prediction.userId, type: 'BET_WON', currency: 'USDT',
                            amount: payout, netAmount: payout, status: 'COMPLETED',
                            description: `Won prediction on ${market.question}`, completedAt: new Date(),
                        },
                    });
                    await tx.user.update({
                        where: { id: prediction.userId },
                        data: { wins: { increment: 1 }, totalWinnings: { increment: payout }, netProfit: { increment: payout - predictionAmount }, currentStreak: { increment: 1 } },
                    });
                } else {
                    await tx.user.update({
                        where: { id: prediction.userId },
                        data: { losses: { increment: 1 }, netProfit: { decrement: predictionAmount }, currentStreak: 0 },
                    });
                    await tx.transaction.create({
                        data: {
                            userId: prediction.userId, type: 'BET_LOST', currency: 'USDT',
                            amount: predictionAmount, netAmount: 0, status: 'COMPLETED',
                            description: `Lost prediction on ${market.question}`, completedAt: new Date(),
                        },
                    });
                }

                await tx.wallet.update({
                    where: { userId: prediction.userId },
                    data: { lockedBalance: { decrement: predictionAmount } },
                });
            }
        });

        return apiSuccess({ message: 'Market settled successfully', outcomeId });
    } catch (error) {
        console.error('Resolve market error:', error);
        return apiError('Failed to resolve market', 500);
    }
}
