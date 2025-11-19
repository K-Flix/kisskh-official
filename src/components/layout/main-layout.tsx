
'use client';

import { usePathname } from 'next/navigation';
import { Header } from './header';
import Link from 'next/link';
import { BackToTopButton } from '../back-to-top-button';

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
    
    // Detail pages will not have a header
    const isDetailPage = /^\/(movie|tv|person)\/.+/.test(pathname);

    return (
        <>
            <div className="flex-1">
                {!isDetailPage && <Header />}
                <main className="flex-1">
                    {isPageWithHero || isDetailPage ? children : <div className="pt-16">{children}</div>}
                </main>
            </div>
            <Footer />
            <BackToTopButton />
        </>
    );
}
