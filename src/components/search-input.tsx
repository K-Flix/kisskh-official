
'use client';

import { useState, useEffect, useRef, useTransition, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { searchMovies } from '@/lib/data';
import type { Movie, Show } from '@/lib/types';
import { useDebounce } from '@/hooks/use-debounce';
import { SearchResultsPopover } from './search-results-popover';

export function SearchInput() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<(Movie | Show)[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLFormElement>(null);

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (debouncedQuery.trim().length > 1) {
      startTransition(async () => {
        const searchResults = await searchMovies(debouncedQuery);
        setResults(searchResults.slice(0, 12)); // Limit to 12 results
      });
    } else {
      setResults([]);
    }
  }, [debouncedQuery]);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      inputRef.current?.blur();
      setIsFocused(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    inputRef.current?.focus();
  };

  const closePopover = useCallback(() => {
    setIsFocused(false);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        closePopover();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [closePopover]);

  return (
    <form onSubmit={handleSearchSubmit} className="relative w-full max-w-sm" ref={containerRef}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      <Input
        ref={inputRef}
        type="text"
        placeholder="Search movies & TV shows..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        className="w-full pl-10 pr-20 bg-white/20 text-white placeholder:text-gray-300 border-white/30 focus:bg-white/30 focus:ring-primary"
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
        {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin text-gray-300" />
        ) : query && (
            <button type="button" onClick={handleClear} className="text-gray-300 hover:text-white">
                <X className="h-4 w-4" />
            </button>
        )}
      </div>

      {isFocused && (query.length > 1) && (
        <SearchResultsPopover
            results={results}
            query={debouncedQuery}
            isLoading={isPending}
            onClose={closePopover}
        />
      )}
    </form>
  );
}
