import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import db from '@/lib/db';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { address } = body;

        if (!address || typeof address !== 'string') {
            return NextResponse.json({ success: false, error: 'Invalid wallet address' }, { status: 400 });
        }

        // Update user in database
        const updatedUser = await db.user.update({
            where: { email: session.user.email },
            data: { walletAddress: address },
        });

        return NextResponse.json({
            success: true,
            message: 'Wallet linked successfully',
            user: { walletAddress: updatedUser.walletAddress }
        });

    } catch (error) {
        console.error('Wallet linking error:', error);
        return NextResponse.json({ success: false, error: 'Failed to link wallet' }, { status: 500 });
    }
}
