'use client';

import { useEffect, useRef } from 'react';
import { useAccount } from 'wagmi';
import { useSession } from 'next-auth/react';

export function WalletLinker() {
    const { address, isConnected } = useAccount();
    const { data: session, update } = useSession();
    const previousAddressRef = useRef<string | null>(null);

    useEffect(() => {
        // If user is connected to Wagmi and has a NextAuth session, but no wallet linked yet, or linked to a diff address
        if (isConnected && address && session?.user && (session.user as any).walletAddress !== address) {
            // Prevent multiple requests for the same address immediately
            if (previousAddressRef.current === address) return;
            previousAddressRef.current = address;

            const linkWallet = async () => {
                try {
                    const res = await fetch('/api/user/link-wallet', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ address }),
                    });

                    if (res.ok) {
                        // Force NextAuth session refresh so the front-end gets the new walletAddress
                        await update();
                    }
                } catch (error) {
                    console.error('Failed to link wallet:', error);
                }
            };

            linkWallet();
        }
    }, [address, isConnected, session, update]);

    return null; // Silent background component
}
