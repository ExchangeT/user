import { headers } from 'next/headers';
import { userAgent } from 'next/server';
import db from './db';

export async function trackUserSession(userId: string) {
    try {
        const headerList = await headers();
        const ip = headerList.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';

        // Mocking location for now as we'd need a GeoIP service (like ipapi.co or similar)
        // In production, you would call a GeoIP API here.
        const city = headerList.get('x-vercel-ip-city') || 'Unknown';
        const country = headerList.get('x-vercel-ip-country') || 'Unknown';
        const region = headerList.get('x-vercel-ip-country-region') || 'Unknown';

        const { device, browser, os, ua } = userAgent({ headers: headerList });

        await (db as any).userSession.create({
            data: {
                userId,
                ipAddress: ip,
                city,
                country,
                region,
                device: device.type || 'desktop',
                browser: browser.name,
                os: os.name,
                userAgent: ua,
                sessionStart: new Date(),
            }
        });
    } catch (error) {
        console.error('Failed to track user session:', error);
    }
}
