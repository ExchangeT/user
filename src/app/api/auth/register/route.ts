import { Prisma } from '@prisma/client';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import db from '@/lib/db';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, username, password, referralCode } = body;

        // 1. Validate Input
        if (!email || !username || !password) {
            return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
        }
        if (password.length < 8) {
            return NextResponse.json({ success: false, error: 'Password must be at least 8 characters' }, { status: 400 });
        }

        // 2. Check for existing users
        const existingEmail = await db.user.findUnique({ where: { email } });
        if (existingEmail) {
            return NextResponse.json({ success: false, error: 'Email is already registered' }, { status: 409 });
        }

        const existingUsername = await db.user.findUnique({ where: { username } });
        if (existingUsername) {
            return NextResponse.json({ success: false, error: 'Username is already taken' }, { status: 409 });
        }

        // 3. Resolve Referral Code
        let referrerId: string | null = null;
        if (referralCode) {
            const referrer = await db.user.findUnique({ where: { referralCode } });
            if (referrer) {
                referrerId = referrer.id;
            }
        }

        // 4. Hash Password
        const passwordHash = await bcrypt.hash(password, 12);

        // ... existing imports

        // 5. Construct User Payload
        const createData: any = {
            email,
            username,
            passwordHash,
            role: 'USER',
            tier: 'SILVER',
            wallet: {
                create: {
                    totalBalance: new Prisma.Decimal(0),
                    availableBalance: new Prisma.Decimal(0),
                    lockedBalance: new Prisma.Decimal(0),
                    balances: {
                        create: [
                            { currency: 'USDT', balance: new Prisma.Decimal(0) },
                            { currency: 'CRIC', balance: new Prisma.Decimal(500) } // Bonus 500 CRIC on signup
                        ]
                    }
                }
            }
        };

        // Inject Referral Relations if a valid referrer was found
        if (referrerId) {
            createData.referredById = referrerId;
            createData.referralsOf = {
                create: {
                    referrerId: referrerId,
                    level: 1,
                }
            };
        }

        // 6. Create User WITH explicitly provisioned Wallets & Referral
        const newUser = await db.user.create({
            data: createData,
            include: { wallet: true }
        });

        // 5. Remove password hash before returning
        const { passwordHash: _, ...safeUser } = newUser;

        return NextResponse.json({
            success: true,
            message: 'User registered successfully',
            data: safeUser
        }, { status: 201 });

    } catch (error: any) {
        console.error('Registration error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error during registration' }, { status: 500 });
    }
}
