import Link from 'next/link';
import { Search, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchInput } from '../search-input';

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="inline-block font-bold text-xl">
              KISS<span className="text-primary">KH</span>
            </span>
          </Link>
        </div>
        
        <div className="hidden md:flex flex-1 items-center justify-center">
            <div className='w-full max-w-md'>
                <SearchInput />
            </div>
        </div>

        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
        </div>
      </div>
    </header>
  );
}

    