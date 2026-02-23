import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import db from '@/lib/db';

// Helper to get authenticated user from session
export async function getAuthUser() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return null;

    const user = await db.user.findUnique({
        where: { email: session.user.email },
        include: { wallet: true },
    });

    return user;
}

// Helper to require authentication
export async function requireAuth() {
    const user = await getAuthUser();
    if (!user) {
        return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }), user: null };
    }
    return { error: null, user };
}

// Helper to require admin role
export async function requireAdmin() {
    const { error, user } = await requireAuth();
    if (error) return { error, user: null };
    if (user!.role !== 'ADMIN' && user!.role !== 'SUPER_ADMIN') {
        return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }), user: null };
    }
    return { error: null, user: user! };
}

// Standard API response helpers
export function apiSuccess<T>(data: T, status = 200) {
    return NextResponse.json({ success: true, data }, { status });
}

export function apiError(message: string, status = 400) {
    return NextResponse.json({ success: false, error: message }, { status });
}

export function apiPaginated<T>(items: T[], total: number, page: number, pageSize: number) {
    return NextResponse.json({
        success: true,
        data: {
            items,
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize),
        },
    });
}
