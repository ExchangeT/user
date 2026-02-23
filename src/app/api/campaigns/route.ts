import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const statusStr = url.searchParams.get('status');

        const where: any = {};
        if (statusStr) {
            where.status = statusStr;
        }

        const campaigns = await db.campaign.findMany({
            where,
            orderBy: {
                startDate: 'desc'
            }
        });

        return NextResponse.json({ success: true, data: campaigns });
    } catch (error) {
        console.error('Failed to fetch campaigns:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch campaigns', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
    }
}
