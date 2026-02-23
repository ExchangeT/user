import { NextRequest } from 'next/server';
import db from '@/lib/db';
import { requireAdmin, apiSuccess, apiError } from '@/lib/api-utils';

// GET /api/admin/settings — All platform settings
export async function GET() {
    const { error } = await requireAdmin();
    if (error) return error;

    const settings = await db.platformSetting.findMany();
    const settingsMap: Record<string, any> = {};

    for (const s of settings) {
        if (s.type === 'number') settingsMap[s.key] = parseFloat(s.value);
        else if (s.type === 'boolean') settingsMap[s.key] = s.value === 'true';
        else if (s.type === 'json') settingsMap[s.key] = JSON.parse(s.value);
        else settingsMap[s.key] = s.value;
    }

    // Include withdrawal fee configs
    const withdrawalFees = await db.withdrawalFeeConfig.findMany({
        include: { chain: true },
    });

    // Include deposit assets
    const depositAssets = await db.depositAsset.findMany({
        include: { chain: true },
        orderBy: { chainId: 'asc' },
    });

    return apiSuccess({
        settings: settingsMap,
        withdrawalFees,
        depositAssets,
    });
}

// PATCH /api/admin/settings — Update a platform setting
export async function PATCH(req: NextRequest) {
    const { error } = await requireAdmin();
    if (error) return error;

    const body = await req.json();
    const { key, value, type } = body;

    if (!key || value === undefined) return apiError('Key and value required', 400);

    const setting = await db.platformSetting.upsert({
        where: { key },
        update: { value: String(value), type: type || 'string' },
        create: { key, value: String(value), type: type || 'string' },
    });

    return apiSuccess(setting);
}
