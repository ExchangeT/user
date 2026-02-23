import { NextResponse } from 'next/server';
import { getMockLiveScores, fetchLiveScores } from '@/lib/cricket-api';

export async function GET() {
    try {
        const scores = await fetchLiveScores();
        if (scores && Array.isArray(scores) && scores.length > 0) {
            return NextResponse.json({ success: true, data: scores });
        }
        return NextResponse.json({ success: true, data: getMockLiveScores() });
    } catch {
        return NextResponse.json({ success: true, data: getMockLiveScores() });
    }
}
