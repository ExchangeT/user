import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
    apiVersion: '2026-01-28.clover',
});

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { amountUSD } = body;

        if (!amountUSD || amountUSD < 5) {
            return NextResponse.json({ success: false, error: 'Minimum deposit is $5 USD' }, { status: 400 });
        }

        const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

        // 1. Check if mock/dev environment
        if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'sk_test_mock') {
            console.log(`[DEV MODE] Simulated Stripe Checkout triggered for $${amountUSD}`);
            // Return a mock URL that hits a simulated success endpoint
            return NextResponse.json({
                success: true,
                url: `${baseUrl}/wallet?status=mock_fiat_success&amount=${amountUSD}`
            });
        }

        // 2. Production Stripe flow
        const checkoutSession = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            customer_email: session.user.email,
            client_reference_id: (session.user as any).id, // CRITICAL: Links the payment to our User DB
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'CricChain USDT Deposit',
                            description: 'Add digital funds to your trading wallet.',
                            images: ['https://cryptologos.cc/logos/tether-usdt-logo.png'],
                        },
                        unit_amount: Math.round(amountUSD * 100), // Stripe expects cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${baseUrl}/wallet?status=success&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${baseUrl}/wallet?status=cancelled`,
            metadata: {
                userId: (session.user as any).id,
                type: 'FIAT_DEPOSIT'
            }
        });

        return NextResponse.json({
            success: true,
            url: checkoutSession.url
        });

    } catch (error: any) {
        console.error('Stripe Checkout Error:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Internal Stripe error'
        }, { status: 500 });
    }
}
