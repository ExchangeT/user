import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        const userId = (session?.user as any)?.id;

        if (!userId) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        const campaign = await db.campaign.findUnique({
            where: { id }
        });

        if (!campaign) {
            return NextResponse.json({ success: false, error: 'Campaign not found' }, { status: 404 });
        }

        if (campaign.status === 'ENDED') {
            return NextResponse.json({ success: false, error: 'Campaign has already ended' }, { status: 400 });
        }

        // Check if already joined
        const existingParticipant = await db.campaignParticipant.findUnique({
            where: {
                userId_campaignId: {
                    userId,
                    campaignId: id
                }
            }
        });

        if (existingParticipant) {
            return NextResponse.json({ success: true, data: { message: 'Already joined this campaign', isJoined: true } }, { status: 200 });
        }

        // Transaction to add participant and increment counter
        await db.$transaction([
            db.campaignParticipant.create({
                data: {
                    userId,
                    campaignId: id,
                }
            }),
            db.campaign.update({
                where: { id },
                data: {
                    totalParticipants: {
                        increment: 1
                    }
                }
            })
        ]);

        return NextResponse.json({ success: true, data: { message: 'Successfully joined campaign', isJoined: true } }, { status: 201 });
    } catch (error) {
        console.error('Failed to join campaign:', error);
        return NextResponse.json({ success: false, error: 'Failed to join campaign', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
    }
}
