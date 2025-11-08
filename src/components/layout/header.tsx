import Link from 'next/link';
import { SearchInput } from '@/components/search-input';
import { Button } from '@/components/ui/button';

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
            <Button variant="ghost" asChild>
              <Link href="/">Home</Link>
            </Button>
            <Button variant="ghost" asChild>
                <Link href="/tv">TV Shows</Link>
            </Button>
            <Button variant="ghost" asChild>
                <Link href="#">Movies</Link>
            </Button>
            <Button variant="ghost" asChild>
                <Link href="#">Discover</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/watchlist">My List</Link>
            </Button>
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
