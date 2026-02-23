import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        const { id } = await params;

        const campaign = await db.campaign.findUnique({
            where: { id }
        });

        if (!campaign) {
            return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
        }

        let isJoined = false;

        // Check if the current user has joined this campaign
        const userId = (session?.user as any)?.id;
        if (userId) {
            const participant = await db.campaignParticipant.findUnique({
                where: {
                    userId_campaignId: {
                        userId,
                        campaignId: id
                    }
                }
            });
            if (participant) {
                isJoined = true;
            }
        }

        return NextResponse.json({
            success: true,
            data: {
                ...campaign,
                isJoined
            }
        });
    } catch (error) {
        console.error('Failed to fetch campaign detail:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch campaign detail', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
    }
}
