'use client';

import { useState, useEffect, useCallback } from 'react';

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

export function useNotifications() {
    const [isSupported, setIsSupported] = useState(false);
    const [permission, setPermission] = useState<NotificationPermission>('default');
    const [subscription, setSubscription] = useState<PushSubscription | null>(null);
    const [loading, setLoading] = useState(true);

    const checkSupport = useCallback(async () => {
        const supported = 'serviceWorker' in navigator && 'PushManager' in window;
        setIsSupported(supported);
        if (supported) {
            setPermission(Notification.permission);
            const registration = await navigator.serviceWorker.ready;
            const sub = await registration.pushManager.getSubscription();
            setSubscription(sub);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        checkSupport();
    }, [checkSupport]);

    const subscribe = async () => {
        if (!isSupported) return;
        setLoading(true);

        try {
            const result = await Notification.requestPermission();
            setPermission(result);

            if (result === 'granted') {
                const registration = await navigator.serviceWorker.ready;

                // If we don't have a VAPID key yet, we can't subscribe for real push
                // but we can at least reg the worker.
                if (!VAPID_PUBLIC_KEY) {
                    console.warn('VAPID_PUBLIC_KEY missing. Push subscription skipped.');
                    setLoading(false);
                    return;
                }

                const sub = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: VAPID_PUBLIC_KEY
                });

                setSubscription(sub);

                // Send to backend
                await fetch('/api/notifications/subscribe', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(sub)
                });
            }
        } catch (err) {
            console.error('Failed to subscribe to notifications:', err);
        } finally {
            setLoading(false);
        }
    };

    const unsubscribe = async () => {
        if (!subscription) return;
        setLoading(true);
        try {
            await subscription.unsubscribe();
            setSubscription(null);
            // Optional: Notify backend to remove
        } catch (err) {
            console.error('Failed to unsubscribe:', err);
        } finally {
            setLoading(false);
        }
    };

    return {
        isSupported,
        permission,
        subscription,
        loading,
        subscribe,
        unsubscribe
    };
}
