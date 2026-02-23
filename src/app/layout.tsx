import type { Metadata } from 'next';
import './globals.css';
import { ToastContainer } from '@/components/ui/Toast';
import { Providers } from '@/components/providers';

export const metadata: Metadata = {
  title: 'CricChain — Decentralized Cricket Prediction Platform',
  description: 'Institutional-grade cricket prediction markets powered by blockchain and AI.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head />
      <body>
        <Providers>
          {children}
          <ToastContainer />
        </Providers>
      </body>
    </html>
  );
}
