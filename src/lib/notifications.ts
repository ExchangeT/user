import webpush from 'web-push';
import { db } from './db';

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || 'mailto:admin@cricchain.com';

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
    webpush.setVapidDetails(
        VAPID_SUBJECT,
        VAPID_PUBLIC_KEY,
        VAPID_PRIVATE_KEY
    );
}

export async function sendPushNotification(userId: string, payload: { title: string; body: string; url?: string }) {
    try {
        const subscriptions = await (db as any).pushSubscription.findMany({
            where: { userId }
        });

        if (!subscriptions.length) return;

        const pushPayload = JSON.stringify(payload);

        const results = await Promise.allSettled(
            subscriptions.map((sub: any) =>
                webpush.sendNotification(
                    {
                        endpoint: sub.endpoint,
                        keys: {
                            p256dh: sub.p256dh,
                            auth: sub.auth
                        }
                    },
                    pushPayload
                )
            )
        );

        // Cleanup expired subscriptions
        results.forEach((result: any, idx: number) => {
            if (result.status === 'rejected' && (result.reason.statusCode === 410 || result.reason.statusCode === 404)) {
                const sub = subscriptions[idx];
                (db as any).pushSubscription.delete({ where: { id: sub.id } }).catch(console.error);
            }
        });

        return results;
    } catch (error) {
        console.error('[PUSH_ERROR]', error);
        throw error;
    }
}
