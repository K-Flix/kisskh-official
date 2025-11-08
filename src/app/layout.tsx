
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { WatchlistProvider } from '@/context/watchlist-context';
import { TooltipProvider } from '@/components/ui/tooltip';
import { MainLayout } from '@/components/layout/main-layout';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Streamss',
  description: 'A streaming website built with Next.js',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable}`}>
      <body className="font-body antialiased min-h-screen bg-background">
        <TooltipProvider>
          <WatchlistProvider>
            <MainLayout>
                {children}
            </MainLayout>
            <Toaster />
          </WatchlistProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
