'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, lightTheme } from '@rainbow-me/rainbowkit';
import { SessionProvider } from 'next-auth/react';
import { wagmiConfig } from '@/lib/wagmi';
import '@rainbow-me/rainbowkit/styles.css';

import { WalletLinker } from '@/components/WalletLinker';

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <WagmiProvider config={wagmiConfig}>
                <QueryClientProvider client={queryClient}>
                    <RainbowKitProvider
                        theme={lightTheme({
                            accentColor: '#f59e0b', // amber-500
                            accentColorForeground: 'white',
                            borderRadius: 'large',
                        })}
                    >
                        <WalletLinker />
                        {children}
                    </RainbowKitProvider>
                </QueryClientProvider>
            </WagmiProvider>
        </SessionProvider>
    );
}
