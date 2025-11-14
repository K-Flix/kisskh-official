
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { WatchlistProvider } from '@/context/watchlist-context';
import { TooltipProvider } from '@/components/ui/tooltip';
import { MainLayout } from '@/components/layout/main-layout';
import { ThemeProvider } from '@/context/theme-context';
import { ThemeInjector } from '@/components/theme-injector';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

const VERCEL_URL = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(VERCEL_URL),
  title: 'kisskh',
  description: 'A free streaming website for movies and TV shows.',
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
  },
  twitter: {
    card: 'summary_large_image',
    title: 'kisskh',
    description: 'A free streaming website for movies and TV shows.',
    images: [`${VERCEL_URL}/og-image.png`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable}`}>
      <body>
        <ThemeProvider>
          <ThemeInjector />
          <TooltipProvider>
              <WatchlistProvider>
                  <MainLayout>
                      {children}
                  </MainLayout>
                  <Toaster />
              </WatchlistProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
