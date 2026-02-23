import { NextResponse } from 'next/server';
import { syncAllCricketData } from '@/lib/cricket-api';

export async function GET(request: Request) {
    try {
        const authHeader = request.headers.get('authorization');

        // In production, Vercel sets this header
        const isVercelCron = authHeader === `Bearer ${process.env.CRON_SECRET}`;

        // For local testing
        const isLocalDev = process.env.NODE_ENV === 'development' &&
            request.headers.get('x-local-cron-key') === 'dev-sync-key';

        if (!isVercelCron && !isLocalDev) {
            return NextResponse.json({ success: false, error: 'Unauthorized CRON execution' }, { status: 401 });
        }

        console.log('[CRON_SYNC] Execution started at:', new Date().toISOString());

        // Execute the heavy sync operation
        const results = await syncAllCricketData();

        console.log('[CRON_SYNC] Execution completed successfully.', results);

        return NextResponse.json({
            success: true,
            message: 'Hourly Match Sync Completed',
            data: results
        });

    } catch (error: any) {
        console.error('[CRON_SYNC] Failed:', error);
        return NextResponse.json({
            success: false,
            error: 'CRON Sync failed',
            details: error.message
        }, { status: 500 });
    }
}
