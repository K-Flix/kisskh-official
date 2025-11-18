
'use client';

import Image from 'next/image';
import { PersonDetails } from '@/lib/types';
import { ArrowLeft, Calendar, Loader2 } from 'lucide-react';
import { ExpandableText } from './expandable-text';
import { MovieCard } from './movie-card';
import { useState, useRef, useCallback } from 'react';
import { Button } from './ui/button';
import { useBack } from '@/hooks/use-back';

interface PersonPageClientProps {
  person: PersonDetails;
}

const ITEMS_PER_PAGE = 18;

export function PersonPageClient({ person }: PersonPageClientProps) {
  const { handleBack } = useBack();
  const [visibleItems, setVisibleItems] = useState(ITEMS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(false);
  const observer = useRef<IntersectionObserver>();

  const hasMore = visibleItems < person.known_for.length;

  const loadMoreItems = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
        setVisibleItems((prev) => Math.min(prev + ITEMS_PER_PAGE, person.known_for.length));
        setIsLoading(false);
    }, 500); // Simulate network delay
  }, [person.known_for.length]);

  const lastItemRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreItems();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore, loadMoreItems]
  );

  return (
    <div className="relative">
        <button onClick={handleBack} className="absolute -top-16 left-0 flex items-center justify-center bg-black/30 p-2 rounded-full hover:bg-black/50 transition-colors z-10">
            <ArrowLeft className="w-6 h-6 text-white"/>
            <span className="sr-only">Back</span>
        </button>
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
            <div className="w-1/2 md:w-1/4 lg:w-1/6 flex-shrink-0 mx-auto md:mx-0">
                <div className="aspect-[2/3] w-full relative overflow-hidden rounded-lg">
                    <Image
                        src={person.profile_path}
                        alt={person.name}
                        fill
                        priority
                        className="object-cover"
                        sizes="(max-width: 768px) 40vw, 16vw"
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
                <div className="w-1.5 h-7 bg-primary rounded-full" />
                <h2 className="text-2xl font-bold">Filmography</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
                {person.known_for.slice(0, visibleItems).map((item, index) => {
                     const isLastItem = index === visibleItems - 1;
                     return (
                        <div key={`${item.id}-${item.media_type}-${index}`} ref={isLastItem ? lastItemRef : null}>
                            <MovieCard movie={item} priority={index < ITEMS_PER_PAGE} />
                        </div>
                    )
                })}
            </div>
            {isLoading && (
                <div className="flex justify-center mt-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            )}
            {!isLoading && hasMore && (
                 <div className="flex justify-center mt-8">
                    <Button onClick={loadMoreItems} variant="secondary">
                        Load More
                    </Button>
                </div>
            )}
        </div>
    </div>
  );
}
