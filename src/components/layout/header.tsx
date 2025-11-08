
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { SearchInput } from '../search-input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Logo } from '../logo';

const navLinks = [
  { href: '/', children: 'Home' },
  { href: '/tv', children: 'TV Shows' },
  { href: '/movies', children: 'Movies' },
  { href: '/discover', children: 'Discover' },
  { href: '/watchlist', children: 'My List' },
];

function NavLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Button variant="ghost" asChild className={cn(isActive && 'bg-accent/50 text-primary')}>
      <Link href={href} onClick={onClick}>
        {children}
      </Link>
    </Button>
  );
}

export function Header() {
  const [isSheetOpen, setSheetOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10 items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Logo />
          </Link>
          <nav className="hidden md:flex gap-2">
            {navLinks.map((link) => (
              <NavLink key={link.href} href={link.href}>
                {link.children}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <SearchInput />
          </div>
          <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <Link href="/" className="flex items-center space-x-2 mb-6">
                <Logo />
              </Link>
              <nav className="flex flex-col gap-3">
                {navLinks.map((link) => (
                  <NavLink key={link.href} href={link.href} onClick={() => setSheetOpen(false)}>
                    {link.children}
                  </NavLink>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
