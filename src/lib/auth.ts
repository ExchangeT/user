import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import type { Adapter } from 'next-auth/adapters';
import bcrypt from 'bcryptjs';
import db from './db';

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(db) as Adapter,
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    pages: {
        signIn: '/login',
        newUser: '/signup',
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        }),
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const user = await db.user.findUnique({
                    where: { email: credentials.email },
                });

                if (!user || !user.passwordHash) return null;

                const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
                if (!isValid) return null;

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name || user.username,
                    image: user.image,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user, account }) {
            // Initial sign in
            if (user) {
                token.id = user.id;
                // Add the rest of the custom fields by querying DB once on sign in
                const dbUser = await db.user.findUnique({
                    where: { id: user.id },
                    select: {
                        role: true,
                        tier: true,
                        username: true,
                        walletAddress: true,
                        referralCode: true,
                    },
                });

                if (dbUser) {
                    token.role = dbUser.role;
                    token.tier = dbUser.tier;
                    token.username = dbUser.username;
                    token.walletAddress = dbUser.walletAddress;
                    token.referralCode = dbUser.referralCode;
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                (session.user as any).id = token.id;
                (session.user as any).role = token.role;
                (session.user as any).tier = token.tier;
                (session.user as any).username = token.username;
                (session.user as any).walletAddress = token.walletAddress;
                (session.user as any).referralCode = token.referralCode;
            }
            return session;
        },
    },
    events: {
        async signIn({ user }) {
            if (user?.id) {
                const { trackUserSession } = await import('./session');
                await trackUserSession(user.id);
            }
        }
    }
};

// Helper to get session server-side
export { authOptions as auth };
