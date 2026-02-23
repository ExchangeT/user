'use client';

import { useEffect } from 'react';
import { pusherClient } from '@/lib/pusher';

/**
 * A hook to subscribe to a Pusher channel and listen for a specific event.
 * @param channelName The name of the Pusher channel to subscribe to.
 * @param eventName The name of the event to listen for.
 * @param callback The function to call when the event is received.
 */
export function useRealtime(channelName: string, eventName: string, callback: (data: any) => void) {
    useEffect(() => {
        // Subscribe to the channel
        const channel = pusherClient.subscribe(channelName);

        // Bind the callback to the event
        channel.bind(eventName, callback);

        // Cleanup on unmount or dependency change
        return () => {
            channel.unbind(eventName, callback);
            pusherClient.unsubscribe(channelName);
        };
    }, [channelName, eventName, callback]);
}
