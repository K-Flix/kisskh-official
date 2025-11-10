
'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MovieCard } from '@/components/movie-card';
import { Movie, Show, Genre, Country } from '@/lib/types';
import { getItems } from '@/lib/data';
import { Loader2, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { DiscoverFilters } from './discover-filters';

interface DiscoverClientPageProps {
  initialItems: (Movie | Show)[];
  initialFilters: Record<string, string | undefined>;
  genres: Genre[];
  countries: Country[];
  years: string[];
  categoryKey: string;
}

export function DiscoverClientPage({ initialItems, initialFilters, genres, countries, years, categoryKey }: DiscoverClientPageProps) {
  const [items, setItems] = useState(initialItems);
  const [page, setPage] = useState(2);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialItems.length > 0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const observer = useRef<IntersectionObserver>();

  const lastItemRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreItems();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );
  
  const loadMoreItems = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    const currentParams = new URLSearchParams(Array.from(searchParams.entries()));
    const filters: Record<string, string> = {};
    currentParams.forEach((value, key) => {
        if(key !== 'category' && key !== 'title') {
            filters[key] = value;
        }
    });

    const hasFilters = Object.keys(filters).length > 0;
    const keyToFetch = categoryKey === 'trending_today' && hasFilters ? 'discover_all' : categoryKey;

    const newItems = await getItems(keyToFetch, page, false, true, filters);
    if (newItems.length > 0) {
      setItems((prev) => [...prev, ...newItems]);
      setPage((prev) => prev + 1);
    } else {
      setHasMore(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    setItems(initialItems);
    setPage(2);
    setHasMore(initialItems.length > 0);
  }, [searchParams, initialItems]);


  const handleFilterChange = useCallback((key: string, value: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    
    if (value && value !== 'all') {
      current.set(key, value);
    } else {
      current.delete(key);
    }
    
    // When a filter changes, we are no longer in a specific "category" view
    current.delete('category');
    current.delete('title');
    
    const search = current.toString();
    const query = search ? `?${search}` : "";

    // We use router.push to re-render the page with new props from the server
    router.push(`/discover${query}`);
  }, [searchParams, router]);

  const handleReset = useCallback(() => {
    // Always reset to the base discover page, which will default to 'trending_today'
    router.push('/discover');
  }, [router]);

  const handleScroll = () => {
    if (window.scrollY > 400) {
      setShowBackToTop(true);
    } else {
      setShowBackToTop(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="space-y-8">
      {!searchParams.get('category') && (
        <DiscoverFilters
          genres={genres}
          countries={countries}
          years={years}
          onFilterChange={handleFilterChange}
          onReset={handleReset}
          currentFilters={initialFilters}
        />
      )}
      {items.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
            {items.map((item, index) => {
            if (items.length === index + 1) {
                return <div ref={lastItemRef} key={item.id}><MovieCard movie={item} /></div>;
            }
            return <MovieCard key={item.id} movie={item} />;
            })}
        </div>
      ) : (
        <div className="text-center py-20">
            <h2 className="text-2xl font-semibold">No results found</h2>
            <p className="text-muted-foreground mt-2">Try adjusting your filters.</p>
        </div>
      )}

      {loading && (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}
       <Button
        size="icon"
        onClick={scrollToTop}
        className={cn(
          'fixed bottom-8 right-8 z-50 rounded-full transition-opacity duration-300',
          showBackToTop ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        aria-label="Back to top"
      >
        <ChevronUp className="w-6 h-6" />
      </Button>
    </div>
  );
}
