
'use client';

import Image from 'next/image';
import { PersonDetails, Movie, Show } from '@/lib/types';
import { ArrowLeft, Calendar, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ExpandableText } from './expandable-text';
import { MovieCard } from './movie-card';
import { useState, useRef, useCallback } from 'react';
import { Button } from './ui/button';
import { safeRouterBack } from '@/lib/navigation';

interface PersonPageClientProps {
  person: PersonDetails;
}

const ITEMS_PER_PAGE = 18;

export function PersonPageClient({ person }: PersonPageClientProps) {
  const router = useRouter();
  const [visibleItems, setVisibleItems] = useState(ITEMS_PER_PAGE);
  const observer = useRef<IntersectionObserver>();

  const loadMoreItems = useCallback(() => {
    setVisibleItems((prev) => Math.min(prev + ITEMS_PER_PAGE, person.known_for.length));
  }, [person.known_for.length]);

  const lastItemRef = useCallback(
    (node: HTMLDivElement) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && visibleItems < person.known_for.length) {
          loadMoreItems();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loadMoreItems, visibleItems, person.known_for.length]
  );
  
  const hasMore = visibleItems < person.known_for.length;

  return (
    <div>
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
            <div className="w-full md:w-1/6 flex-shrink-0">
                <div className="aspect-[2/3] w-full max-w-sm mx-auto md:max-w-none relative overflow-hidden rounded-lg">
                    <Image
                        src={person.profile_path}
                        alt={person.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 80vw, 16vw"
                    />
                </div>
            </div>
            <div className="md:w-5/6">
                <h1 className="text-4xl md:text-5xl font-bold">{person.name}</h1>
                {person.birthday && (
                    <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>Born {new Date(person.birthday).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} in {person.place_of_birth}</span>
                    </div>
                )}
                <div className="mt-4 max-w-3xl">
                   <ExpandableText text={person.biography} />
                </div>
            </div>
        </div>

        <div className="mt-12">
             <div className="flex items-center space-x-3 mb-4">
                <div className="w-1.sem h-7 bg-primary rounded-full" />
                <h2 className="text-2xl font-bold">Filmography</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
                {person.known_for.slice(0, visibleItems).map((item, index) => {
                     const isLastItem = index === visibleItems - 1;
                     return (
                        <div key={`${item.id}-${item.media_type}-${index}`} ref={isLastItem ? lastItemRef : null}>
                            <MovieCard movie={item} />
                        </div>
                    )
                })}
            </div>
            {hasMore && (
                <div className="flex justify-center mt-8">
                    <Button onClick={loadMoreItems}>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Load More
                    </Button>
                </div>
            )}
        </div>
    </div>
  );
}
