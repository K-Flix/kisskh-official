import Link from 'next/link';
import { Clapperboard } from 'lucide-react';
import { SearchInput } from '@/components/search-input';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <Clapperboard className="h-6 w-6 text-primary" />
            <span className="inline-block font-bold text-lg">StreamVerse</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Button variant="ghost" asChild>
              <Link href="/">Home</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/watchlist">Watchlist</Link>
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
