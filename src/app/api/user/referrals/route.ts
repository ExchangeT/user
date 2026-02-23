import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import db from '@/lib/db';

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        // Fetch User and their Referrals Made (downline)
        const userWithReferrals = await db.user.findUnique({
            where: { email: session.user.email },
            select: {
                id: true,
                referralCode: true,
                referralsMade: {
                    include: {
                        referee: {
                            select: {
                                id: true,
                                username: true,
                                createdAt: true,
                                tier: true,
                                totalPredictions: true,
                                netProfit: true
                            }
                        }
                    },
                    orderBy: { createdAt: 'desc' }
                }
            }
        });

        if (!userWithReferrals) {
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }

        const { Prisma } = await import('@prisma/client');

        // Aggregate statistics for the dashboard
        const totalReferrals = userWithReferrals.referralsMade.length;
        const totalEarned = userWithReferrals.referralsMade.reduce(
            (acc, ref) => acc.plus(new Prisma.Decimal(ref.totalEarned as any)),
            new Prisma.Decimal(0)
        ).toNumber();
        const activeTraders = userWithReferrals.referralsMade.filter(ref => ref.referee.totalPredictions > 0).length;

        return NextResponse.json({
            success: true,
            data: {
                referralCode: userWithReferrals.referralCode,
                stats: {
                    totalReferrals,
                    totalEarned,
                    activeTraders
                },
                history: userWithReferrals.referralsMade
            }
        });

    } catch (error: any) {
        console.error('Fetch referrals error:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Internal server error fetching referrals'
        }, { status: 500 });
    }
}
