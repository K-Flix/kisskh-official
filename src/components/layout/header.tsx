
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { SearchInput } from '../search-input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Logo } from '../logo';
import { SearchDialog } from '../search-dialog';

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
    <Button variant="ghost" asChild className={cn('text-white hover:bg-white/10 hover:text-white', isActive && 'bg-white/20 text-white')}>
      <Link href={href} onClick={onClick}>
        {children}
      </Link>
    </Button>
  );
}

export function Header() {
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);

  return (
    <header className="absolute top-0 z-40 w-full bg-gradient-to-b from-black/80 to-transparent">
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

        <div className="flex flex-1 items-center justify-end space-x-2">
          <div className="hidden md:block w-full flex-1 md:w-auto md:flex-none">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                <SearchInput />
            </div>
          </div>
          <Button variant="ghost" size="icon" className="md:hidden text-white hover:bg-white/10 hover:text-white" onClick={() => setSearchOpen(true)}>
            <Search />
            <span className="sr-only">Search</span>
          </Button>

          <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-white hover:bg-white/10 hover:text-white">
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
      <SearchDialog open={isSearchOpen} onOpenChange={setSearchOpen} />
    </header>
  );
}
