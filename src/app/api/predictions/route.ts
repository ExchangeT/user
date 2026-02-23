import { NextRequest } from 'next/server';
import { Prisma } from '@prisma/client';
import db from '@/lib/db';
import { requireAuth, apiSuccess, apiError, apiPaginated } from '@/lib/api-utils';
import { placePredictionSchema } from '@/lib/validators';

// GET /api/predictions — User's predictions
export async function GET(req: NextRequest) {
    const { error: authError, user } = await requireAuth();
    if (authError) return authError;

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status')?.toUpperCase();
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');

    const where: any = { userId: user!.id };
    if (status) where.status = status;

    const [predictions, total] = await Promise.all([
        db.prediction.findMany({
            where,
            include: {
                match: { include: { team1: true, team2: true, tournament: true } },
                market: true,
                outcome: true,
            },
            orderBy: { placedAt: 'desc' },
            skip: (page - 1) * pageSize,
            take: pageSize,
        }),
        db.prediction.count({ where }),
    ]);

    return apiPaginated(predictions, total, page, pageSize);
}



// POST /api/predictions — Place a prediction (core business logic)
export async function POST(req: NextRequest) {
    try {
        const { error: authError, user } = await requireAuth();
        if (authError) return authError;

        const body = await req.json();
        const parsed = placePredictionSchema.safeParse(body);
        if (!parsed.success) return apiError(parsed.error.message, 422);

        const { matchId, marketId, outcomeId, amount } = parsed.data;
        const amountDec = new Prisma.Decimal(amount);

        // 1. Validate market is open
        const market = await db.market.findUnique({
            where: { id: marketId },
            include: { outcomes: true },
        });
        if (!market) return apiError('Market not found', 404);
        if (market.status !== 'OPEN' && market.status !== 'LIVE') return apiError('Market is not open for predictions', 400);
        if (market.matchId !== matchId) return apiError('Market does not match', 400);

        // 2. Validate outcome
        const outcome = market.outcomes.find((o: { id: string; odds: any; name: string }) => o.id === outcomeId);
        if (!outcome) return apiError('Invalid outcome', 400);

        // 3. Check user balance
        const wallet = await db.wallet.findUnique({ where: { userId: user!.id } });
        const availableBalance = wallet ? new Prisma.Decimal(wallet.availableBalance as any) : new Prisma.Decimal(0);

        if (availableBalance.lt(amountDec)) return apiError('Insufficient balance', 400);

        // 4. Calculate fees
        const feePercentDec = new Prisma.Decimal(market.platformFeePercent || 0);
        const feeDec = amountDec.times(feePercentDec).div(100);
        const netStakeDec = amountDec.minus(feeDec);
        const oddsDec = new Prisma.Decimal(outcome.odds as any);
        const potentialPayoutDec = netStakeDec.times(oddsDec);

        // 5. Execute prediction in a transaction
        const prediction = await db.$transaction(async (tx: any) => {
            // Deduct from wallet
            await tx.wallet.update({
                where: { userId: user!.id },
                data: {
                    totalBalance: { decrement: amountDec },
                    availableBalance: { decrement: amountDec },
                    lockedBalance: { increment: netStakeDec },
                },
            });

            // Deduct from USDT balance
            await tx.walletBalance.updateMany({
                where: { wallet: { userId: user!.id }, currency: 'USDT' },
                data: {
                    balance: { decrement: amountDec },
                    lockedBalance: { increment: netStakeDec }
                },
            });

            // Create prediction
            const pred = await tx.prediction.create({
                data: {
                    userId: user!.id,
                    matchId,
                    marketId,
                    outcomeId,
                    amount: netStakeDec,
                    oddsAtPrediction: oddsDec,
                    potentialPayout: potentialPayoutDec,
                    fee: feeDec,
                    feePercent: feePercentDec,
                    status: 'ACTIVE',
                },
            });

            // Update market volume
            await tx.market.update({
                where: { id: marketId },
                data: { totalVolume: { increment: netStakeDec } },
            });

            // Update outcome volume
            await tx.outcome.update({
                where: { id: outcomeId },
                data: { volume: { increment: netStakeDec } },
            });

            // Update match stats
            await tx.match.update({
                where: { id: matchId },
                data: {
                    poolSize: { increment: netStakeDec },
                    totalPredictions: { increment: 1 },
                },
            });

            // Update user stats
            await tx.user.update({
                where: { id: user!.id },
                data: { totalPredictions: { increment: 1 } },
            });

            // Create bet placed transaction
            await tx.transaction.create({
                data: {
                    userId: user!.id,
                    type: 'BET_PLACED',
                    currency: 'USDT',
                    amount: amountDec,
                    fee: feeDec,
                    netAmount: netStakeDec,
                    status: 'COMPLETED',
                    description: `Predicted on ${market.question} — ${outcome.name}`,
                    completedAt: new Date(),
                },
            });

            // Create fee transaction
            if (feeDec.gt(0)) {
                await tx.transaction.create({
                    data: {
                        userId: user!.id,
                        type: 'FEE',
                        currency: 'USDT',
                        amount: feeDec,
                        netAmount: feeDec,
                        status: 'COMPLETED',
                        description: `Platform fee (${feePercentDec}%) on prediction`,
                        completedAt: new Date(),
                    },
                });
            }

            // 6. Process referral instant rewards
            const referral = await tx.referral.findFirst({
                where: { refereeId: user!.id, level: 1 },
            });

            if (referral) {
                const instantRewardPercent = new Prisma.Decimal(process.env.INSTANT_REWARD_PERCENT || '2');
                const rewardAmountDec = netStakeDec.times(instantRewardPercent).div(100);

                if (rewardAmountDec.gt(0)) {
                    // Create referral reward record
                    await tx.referralReward.create({
                        data: {
                            referralId: referral.id,
                            predictionId: pred.id,
                            stakeAmount: netStakeDec,
                            rewardPercent: instantRewardPercent,
                            rewardAmount: rewardAmountDec,
                            tier: 1,
                        },
                    });

                    // Credit referrer's wallet
                    await tx.wallet.update({
                        where: { userId: referral.referrerId },
                        data: {
                            totalBalance: { increment: rewardAmountDec },
                            availableBalance: { increment: rewardAmountDec },
                        },
                    });

                    await tx.walletBalance.updateMany({
                        where: { wallet: { userId: referral.referrerId }, currency: 'USDT' },
                        data: { balance: { increment: rewardAmountDec } },
                    });

                    // Update referral earnings
                    await tx.referral.update({
                        where: { id: referral.id },
                        data: { totalEarned: { increment: rewardAmountDec } },
                    });

                    // Create reward transaction for referrer
                    await tx.transaction.create({
                        data: {
                            userId: referral.referrerId,
                            type: 'REFERRAL_INSTANT_REWARD',
                            currency: 'USDT',
                            amount: rewardAmountDec,
                            netAmount: rewardAmountDec,
                            status: 'COMPLETED',
                            description: `Instant reward (${instantRewardPercent}%) from @${user!.username}'s prediction`,
                            completedAt: new Date(),
                        },
                    });

                    // Notify referrer
                    await tx.notification.create({
                        data: {
                            userId: referral.referrerId,
                            type: 'wallet',
                            icon: '⚡',
                            title: 'Referral Reward!',
                            description: `You earned ₹${rewardAmountDec.toFixed(2)} from @${user!.username}'s prediction`,
                        },
                    });
                }
            }

            return pred;
        });

        return apiSuccess({
            id: prediction.id,
            amount: prediction.amount,
            odds: prediction.oddsAtPrediction,
            fee: feeDec,
            potentialPayout: potentialPayoutDec,
            status: prediction.status,
        }, 201);
    } catch (error) {
        console.error('Place prediction error:', error);
        return apiError('Failed to place prediction', 500);
    }
}
