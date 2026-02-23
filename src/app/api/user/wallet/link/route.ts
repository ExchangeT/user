import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import db from '@/lib/db';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { walletAddress } = body;

        if (!walletAddress) {
            return NextResponse.json({ success: false, error: 'Wallet address is required' }, { status: 400 });
        }

        // 1. Check if the wallet address is already associated with another user
        const existingWallet = await db.user.findUnique({
            where: { walletAddress },
        });

        if (existingWallet && existingWallet.email !== session.user.email) {
            return NextResponse.json({
                success: false,
                error: 'This wallet address is already linked to another account'
            }, { status: 409 });
        }

        // 2. Update the active user's document with the new address
        const updatedUser = await db.user.update({
            where: { email: session.user.email },
            data: { walletAddress },
            select: {
                id: true,
                username: true,
                walletAddress: true,
            }
        });

        return NextResponse.json({
            success: true,
            message: 'Wallet address linked successfully',
            data: updatedUser
        });

    } catch (error: any) {
        console.error('Wallet link error:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Internal server error while linking wallet'
        }, { status: 500 });
    }
}
