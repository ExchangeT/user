import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

// Define the base client
const baseClient = globalForPrisma.prisma ?? new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Extend Prisma to dynamically compute parimutuel odds for Outcomes
export const db = baseClient.$extends({
    result: {
        outcome: {
            currentOdds: {
                needs: { volume: true, marketId: true },
                compute(outcome) {
                    // This is a placeholder. For true dynamic odds, Prisma needs access to the parent Market's totalVolume.
                    // However, Prisma client extensions computing fields don't natively deep-fetch relations asynchronously.
                    // We will handle the precise parimutuel math at the API layer (predictions/place) based on atomic fetches
                    // and use this field simply as a getter if we pass in a precomputed string, or we will abandon this
                    // extension approach in favor of robust explicit API calculations to ensure 100% financial accuracy.

                    // We will return the static odds here as a fallback, but the Prediction Engine will be refactored 
                    // to ignore this and strictly compute the true execution price dynamically.
                    return 0; // Handled by API
                }
            }
        }
    }
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = baseClient;

export default db;
