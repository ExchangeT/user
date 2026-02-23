import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        const match = await db.match.findUnique({
            where: { id },
            include: {
                team1: true,
                team2: true,
                tournament: true,
                markets: {
                    include: {
                        outcomes: true,
                    },
                    // Order markets logically, maybe OPEN first
                    orderBy: {
                        createdAt: 'asc'
                    }
                }
            }
        });

        if (!match) {
            return NextResponse.json({ success: false, error: 'Match not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: match });

    } catch (error) {
        console.error('Error fetching match details:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch match' }, { status: 500 });
    }
}
