import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { pusherServer } from '@/lib/pusher';

export async function GET(request: Request) {
    try {
        const authHeader = request.headers.get('authorization');

        // Ensure this is only executed by Vercel Cron or local admin
        const isVercelCron = authHeader === `Bearer ${process.env.CRON_SECRET}`;
        const isLocalDev = process.env.NODE_ENV === 'development' &&
            request.headers.get('x-local-cron-key') === 'dev-lock-key';

        if (!isVercelCron && !isLocalDev) {
            return NextResponse.json({ success: false, error: 'Unauthorized CRON execution' }, { status: 401 });
        }

        console.log('[CRON_LOCK_MARKETS] Execution started at:', new Date().toISOString());

        // Define "imminent": Any match starting in the next 5 minutes
        const now = new Date();
        const lockThreshold = new Date(now.getTime() + 5 * 60000); // Now + 5 mins

        // 1. Find all UPCOMING matches where startTime <= lockThreshold
        const imminentMatches = await db.match.findMany({
            where: {
                status: 'UPCOMING',
                startTime: { lte: lockThreshold }
            },
            select: { id: true, startTime: true }
        });

        if (imminentMatches.length === 0) {
            console.log('[CRON_LOCK_MARKETS] No imminent matches. Execution finished.');
            return NextResponse.json({ success: true, message: 'No matches to lock' });
        }

        const matchIds = imminentMatches.map(m => m.id);

        // 2. Perform Atomic Transaction to Lock Matches & Associated Markets
        await db.$transaction(async (tx) => {
            // A. Update Match Status to LIVE
            await tx.match.updateMany({
                where: { id: { in: matchIds } },
                data: { status: 'LIVE' }
            });

            // B. Transition all OPEN/UPCOMING Markets attached to these matches to CLOSED
            await tx.market.updateMany({
                where: {
                    matchId: { in: matchIds },
                    status: { in: ['UPCOMING', 'OPEN'] }
                },
                data: { status: 'CLOSED', closeTime: now }
            });

            console.log(`[CRON_LOCK_MARKETS] Locked ${matchIds.length} matches and their markets.`);
        });

        // 3. Broadcast real-time events to all clients
        try {
            for (const matchId of matchIds) {
                await pusherServer.trigger(`match-${matchId}`, 'match-lock', {
                    matchId,
                    newStatus: 'LIVE',
                    message: 'Match has started. All markets are now locked.'
                });
            }
        } catch (pusherError) {
            console.error('[CRON_LOCK_MARKETS] Pusher broadcast failed:', pusherError);
        }

        return NextResponse.json({
            success: true,
            message: `Locked ${matchIds.length} imminent matches.`,
            lockedMatchIds: matchIds
        });

    } catch (error: any) {
        console.error('[CRON_LOCK_MARKETS] Failed:', error);
        return NextResponse.json({
            success: false,
            error: 'CRON Market Lock failed',
            details: error.message
        }, { status: 500 });
    }
}
