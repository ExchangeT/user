import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import db from '@/lib/db';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const user = await db.user.findUnique({
            where: { email: session.user.email },
            select: { id: true, createdAt: true }
        });

        if (!user) {
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }

        // Fetch Live Campaigns and User's Claim History
        const [liveCampaigns, userClaims] = await Promise.all([
            db.campaign.findMany({
                where: { status: 'LIVE' },
                orderBy: { startDate: 'desc' },
                select: {
                    id: true,
                    title: true,
                    description: true,
                    type: true,
                    prizePool: true,
                    endDate: true,
                    _count: { select: { participants: true } }
                }
            }),
            db.campaignParticipant.findMany({
                where: { userId: user.id },
                select: { campaignId: true, joinedAt: true }
            })
        ]);

        const claimedIds = new Set(userClaims.map(c => c.campaignId));

        // Annotate campaigns with whether the user has claimed them
        const campaigns = liveCampaigns.map(campaign => ({
            ...campaign,
            isClaimed: claimedIds.has(campaign.id),
            // Calculate pseudo "Expiration" days left
            daysLeft: Math.max(0, Math.ceil((new Date(campaign.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
        }));

        return NextResponse.json({
            success: true,
            data: {
                campaigns,
                totalEarnedBonuses: userClaims.length // We can expand this if we track exact earned amount per claim
            }
        });

    } catch (error: any) {
        console.error('Fetch user campaigns error:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Internal server error fetching campaigns'
        }, { status: 500 });
    }
}
