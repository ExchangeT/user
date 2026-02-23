import type { Metadata } from 'next';
import './globals.css';
import { ToastContainer } from '@/components/ui/Toast';
import { Providers } from '@/components/providers';

export const metadata: Metadata = {
  title: 'CricChain — Decentralized Cricket Prediction Platform',
  description: 'Institutional-grade cricket prediction markets powered by blockchain and AI.',
};

// Inline script to prevent flash of wrong theme
const themeScript = `
(function() {
  var t = localStorage.getItem('theme') || 'dark';
  var root = document.documentElement;
  root.classList.add(t);
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <Providers>
          {children}
          <ToastContainer />
        </Providers>
      </body>
    </html>
  );
}
