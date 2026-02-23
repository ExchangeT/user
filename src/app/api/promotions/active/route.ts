import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
    try {
        const banners = await db.promotionBanner.findMany({
            where: {
                isActive: true,
                OR: [
                    { startDate: null, endDate: null },
                    { startDate: { lte: new Date() }, endDate: null },
                    { startDate: null, endDate: { gte: new Date() } },
                    { startDate: { lte: new Date() }, endDate: { gte: new Date() } },
                ]
            },
            orderBy: {
                order: 'asc'
            }
        });

        return NextResponse.json({ success: true, data: banners });
    } catch (error) {
        console.error('Failed to fetch active promotions:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch promotions', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
    }
}
