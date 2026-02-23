import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const subscription = await req.json();

        if (!subscription.endpoint || !subscription.keys?.p256dh || !subscription.keys?.auth) {
            return NextResponse.json({ error: 'Invalid subscription object' }, { status: 400 });
        }

        const pushSub = await (db as any).pushSubscription.upsert({
            where: { endpoint: subscription.endpoint },
            update: {
                userId: (session.user as any).id,
                p256dh: subscription.keys.p256dh,
                auth: subscription.keys.auth,
            },
            create: {
                userId: (session.user as any).id,
                endpoint: subscription.endpoint,
                p256dh: subscription.keys.p256dh,
                auth: subscription.keys.auth,
            }
        });

        return NextResponse.json({ success: true, data: pushSub });

    } catch (error: any) {
        console.error('[PUSH_SUBSCRIBE_ERROR]', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
