import { NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';
import { getMockBanners } from '@/lib/cricket-api';

export async function GET() {
    try {
        const now = new Date();

        // Try to fetch active banners from DB
        const banners = await prisma.heroBanner.findMany({
            where: {
                isActive: true,
                OR: [
                    { startDate: null, endDate: null },
                    { startDate: { lte: now }, endDate: null },
                    { startDate: null, endDate: { gte: now } },
                    { startDate: { lte: now }, endDate: { gte: now } },
                ],
            },
            orderBy: { order: 'asc' },
        });

        if (banners.length > 0) {
            return NextResponse.json({ success: true, data: banners });
        }

        // Return mock banners for development
        return NextResponse.json({ success: true, data: getMockBanners() });
    } catch {
        return NextResponse.json({ success: true, data: getMockBanners() });
    }
}
