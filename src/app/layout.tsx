import type { Metadata } from 'next';
import Link from 'next/link';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Toaster } from '@/components/ui/toaster';
import { WatchlistProvider } from '@/context/watchlist-context';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'StreamVerse',
  description: 'A streaming website built with Next.js',
};

function Footer() {
  return (
    <footer className="w-full border-t border-white/10 mt-12">
      <div className="container flex items-center justify-center py-4 text-sm text-muted-foreground">
        <div className="flex space-x-4">
          <Link href="#" className="hover:text-primary">Privacy Policy</Link>
          <Link href="#" className="hover:text-primary">Terms of Service</Link>
          <Link href="#" className="hover:text-primary">FAQ</Link>
        </div>
      </div>
    </footer>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable}`}>
      <body className="font-body antialiased min-h-screen bg-background">
        <WatchlistProvider>
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </WatchlistProvider>
      </body>
    </html>
  );
}
