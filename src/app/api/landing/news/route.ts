import { NextResponse } from 'next/server';
import { getMockNews, fetchCricketNews } from '@/lib/cricket-api';

export async function GET() {
    try {
        const news = await fetchCricketNews();
        if (news && Array.isArray(news) && news.length > 0) {
            return NextResponse.json({ success: true, data: news });
        }
        return NextResponse.json({ success: true, data: getMockNews() });
    } catch {
        return NextResponse.json({ success: true, data: getMockNews() });
    }
}
