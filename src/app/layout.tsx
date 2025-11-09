
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

export const metadata: Metadata = {
  title: 'kisskh',
  description: 'A streaming website built with Next.js',
  icons: {
    icon: [],
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
      </ThemeWrapper>
    </ThemeProvider>
  );
}
