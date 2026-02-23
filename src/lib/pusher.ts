import PusherServer from 'pusher';
import PusherClient from 'pusher-js';

// Server-side Pusher (for triggering events)
export const pusherServer = new PusherServer({
    appId: process.env.PUSHER_APP_ID || 'dummy-id',
    key: process.env.NEXT_PUBLIC_PUSHER_KEY || 'dummy-key',
    secret: process.env.PUSHER_SECRET || 'dummy-secret',
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'mt1',
    useTLS: true,
});

// Client-side Pusher (for subscribing to events)
export const pusherClient = new PusherClient(
    process.env.NEXT_PUBLIC_PUSHER_KEY || 'dummy-key',
    {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'mt1',
    }
);
