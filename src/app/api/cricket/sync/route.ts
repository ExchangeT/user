import { NextResponse } from 'next/server';
import { syncAllCricketData } from '@/lib/cricket-api';

export async function POST(request: Request) {
    try {
        // Simple API key check for admin-triggered syncs
        const authHeader = request.headers.get('authorization');
        const syncKey = process.env.CRICKET_SYNC_KEY || 'cricchain-sync-2026';

        if (authHeader !== `Bearer ${syncKey}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const results = await syncAllCricketData();
        return NextResponse.json({ success: true, data: results });
    } catch (error) {
        return NextResponse.json(
            { error: 'Sync failed', details: String(error) },
            { status: 500 }
        );
    }
}
