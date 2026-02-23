import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/api-utils';
import db from '@/lib/db';
import { getAIOddsForMatch } from '@/lib/ml-client';

export async function GET(req: Request) {
    try {
        const { error: authError } = await requireAdmin();
        if (authError) return authError;

        const { searchParams } = new URL(req.url);
        const matchId = searchParams.get('matchId');

        if (!matchId) {
            return NextResponse.json({ success: false, error: 'Match ID required' }, { status: 400 });
        }

        const match = await db.match.findUnique({
            where: { id: matchId },
            include: { team1: true, team2: true }
        });

        if (!match) {
            return NextResponse.json({ success: false, error: 'Match not found' }, { status: 404 });
        }

        const prediction = await getAIOddsForMatch({
            team1: match.team1.shortName,
            team2: match.team2.shortName,
            venue: match.venue || undefined
        });

        if (!prediction) {
            return NextResponse.json({ success: false, error: 'ML Engine unavailable' }, { status: 503 });
        }

        return NextResponse.json({ success: true, data: prediction });

    } catch (error: any) {
        console.error('ML Proxy Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to generate AI odds' }, { status: 500 });
    }
}
