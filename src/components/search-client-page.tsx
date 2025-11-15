
'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { MovieCard } from '@/components/movie-card';
import { Movie, Show } from '@/lib/types';
import { searchMovies } from '@/lib/data';
import { Loader2 } from 'lucide-react';

interface SearchClientPageProps {
  initialItems: (Movie | Show)[];
  query: string;
}

export function SearchClientPage({ initialItems, query }: SearchClientPageProps) {
  const [items, setItems] = useState(initialItems);
  const [page, setPage] = useState(2);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialItems.length > 0);
  const observer = useRef<IntersectionObserver>();

  const loadMoreItems = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    const newItems = await searchMovies(query, page);
    if (newItems.length > 0) {
      setItems((prev) => [...prev, ...newItems]);
      setPage((prev) => prev + 1);
    } else {
      setHasMore(false);
    }
    setLoading(false);
  }, [loading, hasMore, page, query]);

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
    [loading, hasMore, loadMoreItems]
  );

  useEffect(() => {
    // Reset state when query changes
    setItems(initialItems);
    setPage(2);
    setHasMore(initialItems.length > 0);
  }, [query, initialItems]);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
        {items.map((item, index) => {
          if (items.length === index + 1) {
            return <div ref={lastItemRef} key={item.id}><MovieCard movie={item} /></div>;
          }
          return <MovieCard key={item.id} movie={item} />;
        })}
      </div>
      {loading && (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}
    </>
  );
}
