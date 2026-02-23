import db from '@/lib/db';

export interface AchievementDef {
    id: string;
    name: string;
    description: string;
    rewardCric: number;
}

export const ACHIEVEMENTS: Record<string, AchievementDef> = {
    FIRST_BLOOD: {
        id: 'FIRST_BLOOD',
        name: 'First Blood',
        description: 'Won your first prediction',
        rewardCric: 50
    },
    HOT_STREAK: {
        id: 'HOT_STREAK',
        name: 'Hot Streak',
        description: 'Won 5 predictions in a row',
        rewardCric: 200
    },
    HIGH_ROLLER: {
        id: 'HIGH_ROLLER',
        name: 'High Roller',
        description: 'Placed a prediction over 10,000 USDT',
        rewardCric: 100
    }
};

/**
 * Checks and awards achievements for a user.
 * This should be called during prediction settlement or placement.
 */
export async function checkAndAwardAchievements(userId: string) {
    const user = await db.user.findUnique({
        where: { id: userId },
        include: { predictions: { where: { status: 'WON' } } }
    });

    if (!user) return;

    const awardedAchievements: string[] = [];

    // 1. First Blood
    if (user.predictions.length === 1) {
        awardedAchievements.push('FIRST_BLOOD');
    }

    // 2. Hot Streak
    if (user.currentStreak >= 5) {
        awardedAchievements.push('HOT_STREAK');
    }

    // 3. High Roller (Check if user has any prediction > 10000)
    // This is better checked during placement, but let's do a simple check here for now
    const highRollerPred = await db.prediction.findFirst({
        where: { userId, amount: { gte: 10000 } }
    });
    if (highRollerPred) {
        awardedAchievements.push('HIGH_ROLLER');
    }

    // Award rewards for new achievements
    for (const achievementId of awardedAchievements) {
        const achievement = ACHIEVEMENTS[achievementId];

        // Use a transaction to credit rewards and log it
        // Note: In a real system, you'd have an 'UserAchievements' table to prevent double-awarding
        await awardCricReward(userId, achievement.rewardCric, `Achievement: ${achievement.name}`);
    }
}

async function awardCricReward(userId: string, amount: number, reason: string) {
    const { Prisma } = await import('@prisma/client');
    const amountDec = new Prisma.Decimal(amount);

    try {
        await db.$transaction(async (tx) => {
            const wallet = await tx.wallet.findUnique({ where: { userId } });
            if (!wallet) return;

            // Update CRIC balance
            const cricBalance = await tx.walletBalance.findUnique({
                where: { walletId_currency: { walletId: wallet.id, currency: 'CRIC' } }
            });

            if (cricBalance) {
                await tx.walletBalance.update({
                    where: { id: cricBalance.id },
                    data: { balance: { increment: amountDec } }
                });
            } else {
                await tx.walletBalance.create({
                    data: { walletId: wallet.id, currency: 'CRIC', balance: amountDec }
                });
            }

            // Log transaction
            await tx.transaction.create({
                data: {
                    userId,
                    type: 'REWARD',
                    currency: 'CRIC',
                    amount: amountDec,
                    status: 'COMPLETED',
                    description: reason
                }
            });

            // Log notification
            await tx.notification.create({
                data: {
                    userId,
                    type: 'reward',
                    title: 'Reward Earned!',
                    description: `You earned ${amount} $CRIC for: ${reason}`,
                    icon: '🎁'
                }
            });
        });
    } catch (err) {
        console.error('Failed to award CRIC reward:', err);
    }
}
