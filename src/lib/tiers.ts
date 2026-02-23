import { UserTier } from '@prisma/client';

export interface TierBenefits {
    label: string;
    feePercent: number;
    stakingMultiplier: number;
    referralBonus: number; // Percentage increase to base referral commissions
    minWinningsRequirement: number; // Volume required to reach this tier
    color: string;
}

export const TIER_CONFIG: Record<UserTier, TierBenefits> = {
    BRONZE: {
        label: 'Bronze',
        feePercent: 2.0,
        stakingMultiplier: 1.0,
        referralBonus: 0,
        minWinningsRequirement: 0,
        color: '#cd7f32'
    },
    SILVER: {
        label: 'Silver',
        feePercent: 1.5,
        stakingMultiplier: 1.1,
        referralBonus: 5,
        minWinningsRequirement: 5000,
        color: '#94a3b8'
    },
    GOLD: {
        label: 'Gold',
        feePercent: 1.0,
        stakingMultiplier: 1.25,
        referralBonus: 15,
        minWinningsRequirement: 25000,
        color: '#f4c430'
    },
    PLATINUM: {
        label: 'Platinum',
        feePercent: 0.5,
        stakingMultiplier: 1.5,
        referralBonus: 30,
        minWinningsRequirement: 100000,
        color: '#3b82f6'
    }
};

export function getTierBenefits(tier: UserTier): TierBenefits {
    return TIER_CONFIG[tier] || TIER_CONFIG.BRONZE;
}

import { Prisma } from '@prisma/client';

/**
 * Calculates the platform fee for a stake based on the user's tier.
 */
export function calculateTieredFee(stake: number | Prisma.Decimal, tier: UserTier): number {
    const benefits = getTierBenefits(tier);
    const stakeDec = new Prisma.Decimal(stake as any);
    const feeDec = stakeDec.times(benefits.feePercent).div(100);
    return feeDec.toNumber(); // Return number for backward compatibility where numbers are expected, but calculation is precise
}

/**
 * Calculates the staking reward multiplier based on the user's tier.
 */
export function getStakingMultiplier(tier: UserTier): number {
    return getTierBenefits(tier).stakingMultiplier;
}
