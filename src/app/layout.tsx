
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { WatchlistProvider } from '@/context/watchlist-context';
import { TooltipProvider } from '@/components/ui/tooltip';
import { MainLayout } from '@/components/layout/main-layout';
import { ThemeProvider } from '@/context/theme-context';
import { ThemeWrapper } from '@/components/theme-wrapper';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

const VERCEL_URL = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(VERCEL_URL),
  title: 'kisskh',
  description: 'A streaming website built with Next.js',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    viewportFit: 'cover',
  },
  icons: {
    icon: [],
  },
  openGraph: {
    title: 'kisskh',
    description: 'A free streaming website for movies and TV shows.',
    images: '/og-image.png',
    type: 'website',
    url: VERCEL_URL,
    siteName: 'kisskh',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider>
        <ThemeWrapper>
            <TooltipProvider>
              <WatchlistProvider>
                <MainLayout>
                    {children}
                </MainLayout>
                <Toaster />
              </WatchlistProvider>
            </TooltipProvider>
        </ThemeWrapper>
    </ThemeProvider>
  );
}
