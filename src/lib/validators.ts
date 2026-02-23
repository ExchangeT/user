import { z } from 'zod/v4';

// Auth schemas
export const registerSchema = z.object({
    email: z.email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    username: z.string().min(3, 'Username must be at least 3 characters').max(20).regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
    referralCode: z.string().optional(),
});

export const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(1, 'Password is required'),
});

// Prediction schemas
export const placePredictionSchema = z.object({
    matchId: z.string(),
    marketId: z.string(),
    outcomeId: z.string(),
    amount: z.number().positive('Amount must be positive').min(100, 'Minimum ₹100').max(500000, 'Maximum ₹5,00,000'),
});

export const cashoutSchema = z.object({
    predictionId: z.string(),
});

// Wallet schemas
export const withdrawalSchema = z.object({
    currency: z.string(),
    amount: z.number().positive(),
    chainId: z.string(),
    destinationAddress: z.string().optional(),
    withdrawalType: z.enum(['crypto', 'fiat']),
    bankAccountNumber: z.string().optional(),
    bankIfsc: z.string().optional(),
    bankName: z.string().optional(),
});

export const depositRecordSchema = z.object({
    txHash: z.string(),
    chainId: z.string(),
    currency: z.string(),
    amount: z.number().positive(),
    fromAddress: z.string(),
});

// Admin schemas
export const createMatchSchema = z.object({
    tournamentId: z.string(),
    team1Id: z.string(),
    team2Id: z.string(),
    venue: z.string().min(1),
    startTime: z.iso.datetime(),
});

export const updateMatchSchema = z.object({
    status: z.enum(['UPCOMING', 'LIVE', 'COMPLETED', 'CANCELLED']).optional(),
    score: z.record(z.string(), z.unknown()).optional(),
});

export const createMarketSchema = z.object({
    matchId: z.string(),
    type: z.enum(['MATCH_WINNER', 'TOTAL_RUNS', 'PLAYER_RUNS', 'PLAYER_WICKETS', 'TOSS_WINNER', 'FIRST_INNINGS_SCORE', 'HIGHEST_SCORER']),
    question: z.string().min(1),
    outcomes: z.array(z.object({
        name: z.string().min(1),
        odds: z.number().positive(),
        probability: z.number().min(0).max(100),
    })).min(2),
    openTime: z.iso.datetime(),
    closeTime: z.iso.datetime(),
    platformFeePercent: z.number().min(0).max(10).optional(),
});

export const resolveMarketSchema = z.object({
    outcomeId: z.string(),
});

export const updateSettingsSchema = z.object({
    key: z.string(),
    value: z.string(),
    type: z.enum(['string', 'number', 'boolean', 'json']).optional(),
});

// Shared types for validated data
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type PlacePredictionInput = z.infer<typeof placePredictionSchema>;
export type WithdrawalInput = z.infer<typeof withdrawalSchema>;
export type CreateMatchInput = z.infer<typeof createMatchSchema>;
export type CreateMarketInput = z.infer<typeof createMarketSchema>;
