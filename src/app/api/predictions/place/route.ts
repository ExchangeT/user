import { Prisma } from '@prisma/client';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import db from '@/lib/db';
import { pusherServer } from '@/lib/pusher';
import { calculateTieredFee } from '@/lib/tiers';
import { checkAndAwardAchievements } from '@/lib/achievements';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ success: false, error: 'Unauthorized. Please sign in.' }, { status: 401 });
        }

        const body = await req.json();
        const { matchId, marketId, outcomeId, amount } = body;

        // Basic validation
        if (!matchId || !marketId || !outcomeId || !amount || amount <= 0) {
            return NextResponse.json({ success: false, error: 'Invalid prediction parameters' }, { status: 400 });
        }

        // 1. Fetch User and their Wallet (Strict Balance Check)
        const userWithWallet = await db.user.findUnique({
            where: { email: session.user.email },
            include: {
                wallet: {
                    include: { balances: true }
                }
            }
        });

        if (!userWithWallet || !userWithWallet.wallet) {
            return NextResponse.json({ success: false, error: 'User wallet not found. Please deposit funds.' }, { status: 404 });
        }

        const usdtBalance = (userWithWallet.wallet as any).balances.find((b: any) => b.currency === 'USDT');

        if (!usdtBalance || usdtBalance.balance < amount) {
            return NextResponse.json({
                success: false,
                error: `Insufficient funds. Your USDT balance is ${usdtBalance?.balance || 0} but the wager is ${amount}.`
            }, { status: 400 });
        }

        const userWallet = userWithWallet.wallet;
        const user = userWithWallet;

        // 2. Fetch Match, Market, Outcome to validate state and odds
        const market = await db.market.findUnique({
            where: { id: marketId },
            include: {
                match: {
                    include: { team1: true, team2: true }
                },
                outcomes: true
            }
        });

        if (!market || market.matchId !== matchId) {
            return NextResponse.json({ success: false, error: 'Market not found or invalid' }, { status: 404 });
        }

        // CRITICAL SECURITY: Prevent late betting on Closed or locked markets
        if (market.status !== 'UPCOMING' && market.status !== 'OPEN') {
            return NextResponse.json({
                success: false,
                error: `Betting is closed. Market status is currently: ${market.status}`
            }, { status: 403 });
        }

        if (market.match.status === 'LIVE' || market.match.status === 'COMPLETED') {
            return NextResponse.json({
                success: false,
                error: `Match has already started or ended. Live betting is locked.`
            }, { status: 403 });
        }

        if (market.closeTime && new Date() >= new Date(market.closeTime)) {
            return NextResponse.json({
                success: false,
                error: `Market officially closed at ${new Date(market.closeTime).toLocaleTimeString()}`
            }, { status: 403 });
        }

        if (market.status !== 'OPEN') {
            return NextResponse.json({ success: false, error: 'Market is currently closed' }, { status: 400 });
        }

        const outcome = market.outcomes.find(o => o.id === outcomeId);
        if (!outcome) {
            return NextResponse.json({ success: false, error: 'Outcome not found' }, { status: 404 });
        }

        // 3. Financial calculations - Parimutuel Dynamic Odds
        const amountDec = new Prisma.Decimal(amount);
        const feeDec = new Prisma.Decimal(calculateTieredFee(amount, user.tier));
        const netWager = amountDec.minus(feeDec);

        const currentMarketVol = market.totalVolume ? new Prisma.Decimal(market.totalVolume as any) : new Prisma.Decimal(0);
        const currentOutcomeVol = outcome.volume ? new Prisma.Decimal(outcome.volume as any) : new Prisma.Decimal(0);
        const liquidity = market.liquidity ? new Prisma.Decimal(market.liquidity as any) : new Prisma.Decimal(1000);

        const totalPool = currentMarketVol.plus(liquidity).plus(netWager);
        const outcomePoolRaw = currentOutcomeVol.plus(liquidity.div(market.outcomes.length)).plus(netWager);
        const outcomePool = outcomePoolRaw.isZero() ? new Prisma.Decimal(1) : outcomePoolRaw;

        // Calculate True Parimutuel Execution Price with high precision
        const trueOdds = totalPool.div(outcomePool).toDecimalPlaces(2, Prisma.Decimal.ROUND_DOWN);

        // Payout calculation
        const potentialPayout = netWager.times(trueOdds);
        const feePercent = feeDec.div(amountDec).times(100);

        // 4. Atomic Transaction Engine
        const result = await db.$transaction(async (tx) => {
            // Deduct from USDT balance
            const updatedUsdtBalance = await tx.walletBalance.update({
                where: {
                    walletId_currency: {
                        walletId: userWallet!.id,
                        currency: 'USDT'
                    }
                },
                data: { balance: { decrement: amount } }
            });

            // Update master wallet totals
            await tx.wallet.update({
                where: { id: userWallet!.id },
                data: {
                    availableBalance: { decrement: amount },
                    totalBalance: { decrement: amount }
                }
            });

            // Prevent negative balance (double check)
            if (Number(updatedUsdtBalance.balance) < 0) {
                throw new Error('Insufficient USDT balance');
            }

            // Record transaction ledger entry
            await tx.transaction.create({
                data: {
                    userId: user.id,
                    type: 'BET_PLACED',
                    amount: -amount,
                    netAmount: -amount,
                    currency: 'USDT',
                    status: 'COMPLETED',
                    description: `Placed prediction on market ${market.id}`,
                }
            });

            // Create Prediction Record
            const prediction = await tx.prediction.create({
                data: {
                    userId: user.id,
                    matchId: matchId,
                    marketId: market.id,
                    outcomeId: outcome.id,
                    amount: amountDec,
                    oddsAtPrediction: trueOdds,
                    potentialPayout: potentialPayout,
                    fee: feeDec,
                    feePercent: feePercent,
                    status: 'PENDING'
                }
            });

            // Update Volume Counters (Market & Outcome levels)
            await tx.market.update({
                where: { id: marketId },
                data: { totalVolume: { increment: amount } }
            });

            await tx.outcome.update({
                where: { id: outcomeId },
                data: {
                    volume: { increment: amount },
                    odds: trueOdds
                }
            });

            // Update Counter-party Odds based on shifted liquidity
            const remainingOutcomes = market.outcomes.filter(o => o.id !== outcomeId);
            for (const otherOutcome of remainingOutcomes) {
                const otherOutcomeVol = otherOutcome.volume ? new Prisma.Decimal(otherOutcome.volume as any) : new Prisma.Decimal(0);
                const otherOutcomePoolRaw = otherOutcomeVol.plus(liquidity.div(market.outcomes.length));
                const otherOutcomePool = otherOutcomePoolRaw.isZero() ? new Prisma.Decimal(1) : otherOutcomePoolRaw;
                const otherTrueOdds = totalPool.div(otherOutcomePool).toDecimalPlaces(2, Prisma.Decimal.ROUND_DOWN);

                await tx.outcome.update({
                    where: { id: otherOutcome.id },
                    data: { odds: otherTrueOdds }
                });
            }

            return prediction;
        });

        // 5. Trigger Achievement Check (Async)
        checkAndAwardAchievements(user.id).catch(err => console.error('Achievement award failed:', err));

        const response = NextResponse.json({
            success: true,
            message: 'Prediction placed successfully',
            prediction: result
        });

        // Trigger Real-time Events
        try {
            // 1. Global Activity Feed (Social Proof)
            await pusherServer.trigger('global-activity', 'new-prediction', {
                id: result.id,
                user: user.name || 'Anonymous',
                userImage: user.image,
                amount: result.amount,
                match: `${market.match.team1.shortName} vs ${market.match.team2.shortName}`,
                outcome: outcome.name,
                time: new Date()
            });

            // 2. Dynamic Odds Update (Match Instance)
            const updatedOutcomes = await db.outcome.findMany({
                where: { marketId }
            });

            await pusherServer.trigger(`match-${matchId}`, 'odds-update', {
                matchId,
                marketId,
                outcomes: updatedOutcomes.map(o => ({
                    id: o.id,
                    odds: o.odds
                }))
            });
        } catch (pusherError) {
            console.error('Pusher Broadcast Error:', pusherError);
        }

        return response;

    } catch (error: any) {
        console.error('Prediction Engine Error:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'An internal error occurred while placing prediction'
        }, { status: 500 });
    }
}
