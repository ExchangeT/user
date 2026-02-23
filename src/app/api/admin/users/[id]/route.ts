import { NextRequest } from 'next/server';
import db from '@/lib/db';
import { requireAdmin, apiSuccess, apiError } from '@/lib/api-utils';

// PATCH /api/admin/users/[id] — Update user (ban, KYC, tier)
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { error } = await requireAdmin();
    if (error) return error;

    const { id } = await params;
    const body = await req.json();
    const { isActive, tier, role } = body;

    const updateData: Record<string, unknown> = {};
    if (isActive !== undefined) updateData.isActive = isActive;
    if (tier) updateData.tier = tier;
    if (role) updateData.role = role;

    const user = await db.user.update({
        where: { id },
        data: updateData,
        select: { id: true, email: true, username: true, isActive: true, tier: true, role: true },
    });

    return apiSuccess(user);
}
