import type { Metadata } from 'next';
import './globals.css';
import { ToastContainer } from '@/components/ui/Toast';
import { Providers } from '@/components/providers';

export const metadata: Metadata = {
  title: 'CricChain - Global Decentralized Cricket Prediction Platform',
  description: 'The world\'s first decentralized cricket prediction platform powered by blockchain and AI',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
          <ToastContainer />
        </Providers>
      </body>
    </html>
  );
}
