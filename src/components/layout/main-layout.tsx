
'use client';

import { usePathname } from 'next/navigation';
import { Header } from './header';
import Link from 'next/link';

function Footer() {
  return (
    <footer className="w-full border-t border-white/10 mt-12">
      <div className="container flex flex-col sm:flex-row items-center justify-between py-4 text-sm text-muted-foreground gap-4">
        <span>&copy; {new Date().getFullYear()} kisskh. All Rights Reserved.</span>
        <div className="flex space-x-4">
          <Link href="/privacy-policy" className="hover:text-primary">Privacy Policy</Link>
          <Link href="/terms-of-service" className="hover:text-primary">Terms of Service</Link>
          <Link href="/faq" className="hover:text-primary">FAQ</Link>
        </div>
      </div>
    </footer>
  );
}

export function MainLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isPageWithHero = ['/', '/movies', '/tv'].includes(pathname);
    const isDetailPage = pathname.startsWith('/movie/') || pathname.startsWith('/tv/') || pathname.startsWith('/person/');
    
    return (
        <div className="relative flex min-h-screen flex-col">
            {!isDetailPage && <Header />}
            <main className="flex-1">
                {isPageWithHero || isDetailPage ? children : 
                 <div className="pt-16">{children}</div>
                }
            </main>
            <Footer />
        </div>
    );
}
