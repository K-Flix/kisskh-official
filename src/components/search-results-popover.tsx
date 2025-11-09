
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Loader2, Search } from 'lucide-react';
import type { Movie, Show } from '@/lib/types';
import { Button } from './ui/button';

interface SearchResultsPopoverProps {
  results: (Movie | Show)[];
  query: string;
  isLoading: boolean;
  onClose: () => void;
  onSelect?: () => void;
}

export function SearchResultsPopover({ results, query, isLoading, onClose, onSelect }: SearchResultsPopoverProps) {
  const handleLinkClick = () => {
    onClose();
    onSelect?.();
  };

  return (
    <div className="absolute top-full mt-2 w-full bg-background border border-border rounded-lg shadow-lg z-50 max-h-[70vh] flex flex-col">
      <div className="overflow-y-auto flex-grow">
        {isLoading && results.length === 0 ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : !isLoading && results.length === 0 && query ? (
          <div className="text-center text-muted-foreground p-8">
            <p>No results for &quot;{query}&quot;</p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {results.map((item) => {
              const href = item.media_type === 'tv' ? `/tv/${item.id}` : `/movie/${item.id}`;
              const year = item.release_date ? new Date(item.release_date).getFullYear() : 'N/A';
              return (
                <li key={item.id}>
                  <Link href={href} onClick={handleLinkClick} className="flex items-center gap-4 p-3 hover:bg-secondary/50 transition-colors">
                    <div className="relative w-12 h-16 flex-shrink-0 bg-muted rounded-md overflow-hidden">
                      <Image
                        src={item.poster_path}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="50px"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold truncate">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{year} &middot; {item.media_type === 'tv' ? 'TV Series' : 'Movie'}</p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      {query && (
        <div className="p-2 border-t border-border">
          <Button variant="ghost" className="w-full justify-start" asChild onClick={handleLinkClick}>
             <Link href={`/search?q=${encodeURIComponent(query)}`}>
                <Search className="mr-2 h-4 w-4" />
                View all results for &quot;{query}&quot;
             </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
