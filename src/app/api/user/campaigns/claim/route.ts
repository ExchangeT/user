import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import db from '@/lib/db';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { campaignId } = body;

        if (!campaignId) {
            return NextResponse.json({ success: false, error: 'Campaign ID missing' }, { status: 400 });
        }

        const user = await db.user.findUnique({
            where: { email: session.user.email },
            include: { wallet: true }
        });

        if (!user || !user.wallet) {
            return NextResponse.json({ success: false, error: 'User or wallet not found' }, { status: 404 });
        }

        // 1. Fetch Campaign
        const campaign = await db.campaign.findUnique({
            where: { id: campaignId }
        });

        if (!campaign) {
            return NextResponse.json({ success: false, error: 'Campaign not found' }, { status: 404 });
        }
        if (campaign.status !== 'LIVE') {
            return NextResponse.json({ success: false, error: 'Campaign is not currently active' }, { status: 400 });
        }

        // 2. Prevent Double Claim (Idempotency Check)
        const existingClaim = await db.campaignParticipant.findUnique({
            where: {
                userId_campaignId: {
                    userId: user.id,
                    campaignId: campaignId
                }
            }
        });

        if (existingClaim) {
            return NextResponse.json({ success: false, error: 'You have already claimed this campaign' }, { status: 400 });
        }

        // 3. Execute Transaction
        const rewardAmount = campaign.prizePool; // Using prizePool field as the fixed bonus amount for MVP

        await db.$transaction(async (tx) => {
            // A. Mark as Participated / Claimed
            await tx.campaignParticipant.create({
                data: {
                    userId: user.id,
                    campaignId: campaign.id,
                    status: 'COMPLETED'
                }
            });

            // B. Credit Wallet (CRIC Token for Promotions)
            // Ensure CRIC balance exists, otherwise create it
            const cricBalance = await tx.walletBalance.findUnique({
                where: { walletId_currency: { walletId: user.wallet!.id, currency: 'CRIC' } }
            });

            if (cricBalance) {
                await tx.walletBalance.update({
                    where: { id: cricBalance.id },
                    data: { balance: { increment: rewardAmount } }
                });
            } else {
                await tx.walletBalance.create({
                    data: {
                        walletId: user.wallet!.id,
                        currency: 'CRIC',
                        balance: rewardAmount,
                        lockedBalance: 0
                    }
                });
            }

            // C. Create Ledger Transaction
            await tx.transaction.create({
                data: {
                    userId: user.id,
                    type: 'REWARD',
                    amount: rewardAmount,
                    currency: 'CRIC',
                    status: 'COMPLETED',
                    description: `campaign_${campaign.id}`,
                    metadata: { type: campaign.type, title: campaign.title }
                }
            });

            // D. Increment Campaign stats
            await tx.campaign.update({
                where: { id: campaign.id },
                data: { totalParticipants: { increment: 1 } }
            });
        });

        return NextResponse.json({
            success: true,
            message: `Successfully claimed ${rewardAmount} CRIC!`,
            data: { rewardAmount, currency: 'CRIC' }
        });

    } catch (error: any) {
        console.error('Claim campaign error:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Internal server error processing claim'
        }, { status: 500 });
    }
}
