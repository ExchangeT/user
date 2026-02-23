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
        const chainId = searchParams.get('chainId');

        if (!chainId) {
            return NextResponse.json({ success: false, error: 'Chain ID is required.' }, { status: 400 });
        }

        // 1. Check if address already exists
        let depositAddr = await (db as any).depositAddress.findUnique({
            where: {
                userId_chainId: {
                    userId: (session.user as any).id,
                    chainId
                }
            }
        });

        // 2. If not, generate/assign one (Placeholder for MVP: random address)
        // In a real production system, this would call a secure vault or HSM
        if (!depositAddr) {
            const randomSuffix = Math.random().toString(16).substring(2, 10);
            const mockAddress = chainId === 'solana'
                ? `Cric${randomSuffix}${randomSuffix}AddressBase58`
                : `0x${randomSuffix}cricchain${randomSuffix}address`;

            depositAddr = await (db as any).depositAddress.create({
                data: {
                    userId: (session.user as any).id,
                    chainId,
                    address: mockAddress
                }
            });
        }

        return NextResponse.json({
            success: true,
            address: depositAddr.address
        });

    } catch (error: any) {
        console.error('[DEPOSIT_ADDRESS_ERROR]', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to fetch deposit address'
        }, { status: 500 });
    }
}
