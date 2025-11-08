
'use client';

import { useState, useRef, useCallback } from 'react';
import { MovieCard } from '@/components/movie-card';
import { Movie, Show } from '@/lib/types';
import { getItems } from '@/lib/data';
import { Loader2 } from 'lucide-react';

interface CategoryClientPageProps {
  initialItems: (Movie | Show)[];
  slug: string;
}

export function CategoryClientPage({ initialItems, slug }: CategoryClientPageProps) {
  const [items, setItems] = useState(initialItems);
  const [page, setPage] = useState(2);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialItems.length > 0);
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
    const newItems = await getItems(slug, page);
    if (newItems.length > 0) {
      setItems((prev) => [...prev, ...newItems]);
      setPage((prev) => prev + 1);
    } else {
      setHasMore(false);
    }
    setLoading(false);
  };

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
