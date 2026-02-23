import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import db from '@/lib/db';

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !(session.user as any)?.id) {
            return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const limit = Number(searchParams.get('limit')) || 50;

        const transactions = await db.transaction.findMany({
            where: { userId: (session.user as any).id },
            orderBy: { createdAt: 'desc' },
            take: limit
        });

        return NextResponse.json({ success: true, data: transactions });

    } catch (error: any) {
        console.error('Failed to fetch transactions:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'An internal error occurred fetching transactions'
        }, { status: 500 });
    }
}
