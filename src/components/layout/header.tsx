import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SearchInput } from '../search-input';

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Button variant="ghost" asChild>
      <Link href={href}>{children}</Link>
    </Button>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10 items-center">
          <Link href="/" className="flex items-center space-x-2">
            <span className="inline-block font-bold text-lg">
              KISS<span className="text-primary">KH</span>
            </span>
          </Link>
          <nav className="hidden md:flex gap-4">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/tv">TV Shows</NavLink>
            <NavLink href="#">Movies</NavLink>
            <NavLink href="#">Discover</NavLink>
            <NavLink href="/watchlist">My List</NavLink>
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
             <SearchInput />
          </nav>
        </div>
      </div>
    </header>
  );
}