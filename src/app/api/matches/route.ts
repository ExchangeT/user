import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
    try {
        const matches = await db.match.findMany({
            where: {
                status: {
                    in: ['UPCOMING', 'LIVE', 'COMPLETED']
                }
            },
            orderBy: {
                startTime: 'asc'
            },
            include: {
                team1: true,
                team2: true,
                tournament: true,
                _count: {
                    select: { markets: true, predictions: true }
                }
            }
        });

        return NextResponse.json({ success: true, count: matches.length, data: matches });
    } catch (error) {
        console.error('Error fetching matches:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch matches' }, { status: 500 });
    }
}
