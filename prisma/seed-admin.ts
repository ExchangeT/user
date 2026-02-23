import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding admin data...');

    // 1. Create default roles
    const roles = [
        {
            name: 'SUPER_ADMIN',
            displayName: 'Super Admin',
            description: 'Full platform access. Can manage roles, settings, and all admin operations.',
            permissions: [
                'users.read', 'users.write', 'matches.read', 'matches.write',
                'predictions.read', 'predictions.write', 'transactions.read', 'transactions.write',
                'deposits.read', 'deposits.write', 'referrals.read', 'referrals.write',
                'banners.read', 'banners.write', 'roles.read', 'roles.write',
                'settings.read', 'settings.write',
            ],
            isDefault: true,
        },
        {
            name: 'ADMIN',
            displayName: 'Admin',
            description: 'Full operational access. Cannot manage roles or critical settings.',
            permissions: [
                'users.read', 'users.write', 'matches.read', 'matches.write',
                'predictions.read', 'predictions.write', 'transactions.read', 'transactions.write',
                'deposits.read', 'deposits.write', 'referrals.read', 'referrals.write',
                'banners.read', 'banners.write',
            ],
            isDefault: true,
        },
        {
            name: 'CUSTOMER_SUPPORT',
            displayName: 'Customer Support',
            description: 'Read-only access to users, transactions, and referrals for support purposes.',
            permissions: [
                'users.read', 'matches.read', 'predictions.read',
                'transactions.read', 'deposits.read', 'referrals.read',
            ],
            isDefault: true,
        },
        {
            name: 'OPERATIONS',
            displayName: 'Operations',
            description: 'Can manage matches, predictions, and markets. No financial or user access.',
            permissions: [
                'matches.read', 'matches.write', 'predictions.read',
                'predictions.write', 'campaigns.read',
            ],
            isDefault: true,
        },
    ];

    for (const role of roles) {
        await prisma.adminRole.upsert({
            where: { name: role.name },
            update: { permissions: role.permissions, description: role.description },
            create: role,
        });
        console.log(`  ✅ Role: ${role.displayName}`);
    }

    // 2. Create super admin user
    const superAdminRole = await prisma.adminRole.findUnique({ where: { name: 'SUPER_ADMIN' } });
    if (superAdminRole) {
        const passwordHash = await bcrypt.hash('admin123', 12);
        await prisma.adminUser.upsert({
            where: { email: 'superadmin@cricchain.io' },
            update: {},
            create: {
                email: 'superadmin@cricchain.io',
                name: 'Super Admin',
                passwordHash,
                roleId: superAdminRole.id,
                isActive: true,
            },
        });
        console.log('  ✅ Super Admin user: superadmin@cricchain.io / admin123');
    }

    // 3. Seed some sample teams
    const teams = [
        { name: 'Mumbai Indians', shortName: 'MI', color: '#004BA0' },
        { name: 'Chennai Super Kings', shortName: 'CSK', color: '#F9CD05' },
        { name: 'Royal Challengers Bengaluru', shortName: 'RCB', color: '#EC1C24' },
        { name: 'Kolkata Knight Riders', shortName: 'KKR', color: '#3A225D' },
        { name: 'Sunrisers Hyderabad', shortName: 'SRH', color: '#FF822A' },
        { name: 'Rajasthan Royals', shortName: 'RR', color: '#EA1A85' },
        { name: 'Delhi Capitals', shortName: 'DC', color: '#004C93' },
        { name: 'Punjab Kings', shortName: 'PBKS', color: '#ED1B24' },
        { name: 'Gujarat Titans', shortName: 'GT', color: '#1C1C1C' },
        { name: 'Lucknow Super Giants', shortName: 'LSG', color: '#A72056' },
    ];

    for (const team of teams) {
        await prisma.team.upsert({
            where: { shortName: team.shortName },
            update: {},
            create: { ...team, logo: '' },
        });
    }
    console.log(`  ✅ ${teams.length} IPL teams seeded`);

    // 4. Seed IPL 2026 tournament
    await prisma.tournament.upsert({
        where: { shortName_season: { shortName: 'IPL', season: '2026' } },
        update: {},
        create: { name: 'Indian Premier League 2026', shortName: 'IPL', season: '2026', isActive: true },
    });
    console.log('  ✅ IPL 2026 tournament seeded');

    // 5. Seed sample banners
    const banners = [
        {
            title: 'IPL 2026 Is Here!',
            subtitle: 'Make predictions on every match. Win big this season.',
            ctaText: 'Start Predicting',
            ctaLink: '/matches',
            imageUrl: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=1200&h=600&fit=crop',
            isActive: true,
            order: 1,
            eventTag: 'IPL 2026',
            startDate: new Date('2026-03-01'),
            endDate: new Date('2026-05-31'),
        },
        {
            title: 'Welcome Bonus — Get ₹500 Free',
            subtitle: 'Sign up today and get ₹500 in prediction credits. No deposit required.',
            ctaText: 'Claim Now',
            ctaLink: '/auth/signup',
            imageUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1200&h=600&fit=crop',
            isActive: true,
            order: 2,
            eventTag: 'Promotion',
        },
    ];

    for (const banner of banners) {
        const existing = await prisma.heroBanner.findFirst({ where: { title: banner.title } });
        if (!existing) {
            await prisma.heroBanner.create({ data: banner });
        }
    }
    console.log(`  ✅ ${banners.length} banners seeded`);

    console.log('\n🎉 Seed complete!');
}

main()
    .catch((e) => {
        console.error('Seed error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
