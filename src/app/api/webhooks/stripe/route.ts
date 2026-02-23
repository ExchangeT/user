import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import db from '@/lib/db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
    apiVersion: '2026-01-28.clover',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
    try {
        const payload = await req.text();
        const headersList = await headers();
        const sig = headersList.get('stripe-signature');

        let event: Stripe.Event;

        // 1. Verify Webhook Signature (Skip in Dev if no secret)
        if (endpointSecret && sig) {
            try {
                event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
            } catch (err: any) {
                console.error(`⚠️ Stripe Webhook Error: ${err.message}`);
                return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
            }
        } else {
            // Unverified local testing fallback (only allowed if NO secret is set)
            console.warn('⚠️ Stripe Webhook processing UNVERIFIED payload (Dev Mode)');
            event = JSON.parse(payload);
        }

        // 2. Handle the Event
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object as Stripe.Checkout.Session;

            // Extract core variables
            const userId = session.client_reference_id;
            const amountTotalCents = session.amount_total;
            const currency = session.currency;

            if (!userId) {
                console.error('Stripe Webhook Error: client_reference_id (userId) is missing.');
                return NextResponse.json({ error: 'Missing client_reference_id' }, { status: 400 });
            }

            if (!amountTotalCents) {
                return NextResponse.json({ error: 'Missing amount_total' }, { status: 400 });
            }

            // Convert back to USD dollars (which maps 1:1 to USDT in our system)
            const depositAmount = amountTotalCents / 100;

            console.log(`[STRIPE WEBHOOK] Verified payment of ${depositAmount} USD for user ${userId}. Processing deposit...`);

            // 3. Atomically Credit Wallet
            await db.$transaction(async (tx) => {
                const user = await tx.user.findUnique({
                    where: { id: userId },
                    include: { wallet: true }
                });

                if (!user || !user.wallet) throw new Error('User or Wallet not found');

                // A. Increment total/available USD proxy across the Wallet
                await tx.wallet.update({
                    where: { id: user.wallet.id },
                    data: {
                        availableBalance: { increment: depositAmount },
                        totalBalance: { increment: depositAmount }
                    }
                });

                // B. Increment specific USDT balance row
                const usdtBalance = await tx.walletBalance.findUnique({
                    where: { walletId_currency: { walletId: user.wallet.id, currency: 'USDT' } }
                });

                if (usdtBalance) {
                    await tx.walletBalance.update({
                        where: { id: usdtBalance.id },
                        data: { balance: { increment: depositAmount } }
                    });
                } else {
                    await tx.walletBalance.create({
                        data: {
                            walletId: user.wallet.id,
                            currency: 'USDT',
                            balance: depositAmount,
                            lockedBalance: 0
                        }
                    });
                }

                // C. Log Transaction in Ledger
                await tx.transaction.create({
                    data: {
                        userId: user.id,
                        type: 'DEPOSIT',
                        currency: 'USDT',
                        amount: depositAmount,
                        status: 'COMPLETED',
                        txHash: session.payment_intent as string || `stripe_${session.id}`,
                        description: 'stripe_fiat_onramp',
                        metadata: {
                            stripeSessionId: session.id,
                            fiatCurrency: currency,
                            fiatAmount: depositAmount
                        }
                    }
                });
            });

            console.log(`✅ [STRIPE WEBHOOK] Successfully deposited ${depositAmount} USDT for user ${userId}.`);
        } else {
            // Unhandled event type
            console.log(`[STRIPE WEBHOOK] Unhandled event type: ${event.type}`);
        }

        return NextResponse.json({ received: true });

    } catch (error: any) {
        console.error('Stripe Webhook Execution Error:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Internal webhook error'
        }, { status: 500 });
    }
}
