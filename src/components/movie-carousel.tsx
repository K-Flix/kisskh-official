
'use client';

import type { Movie, Show } from '@/lib/types';
import { MovieCard } from '@/components/movie-card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Link from 'next/link';
import { Button } from './ui/button';

interface MovieCarouselProps {
  title: string;
  movies: (Movie | Show)[];
  seeAllHref?: string;
}

export function MovieCarousel({ title, movies, seeAllHref }: MovieCarouselProps) {
  if (!movies || movies.length === 0) return null;
  
  return (
    <div className="space-y-4">
      <div className='flex justify-between items-center'>
        <div className="flex items-center space-x-3">
          <div className="w-1.5 h-7 bg-primary rounded-full" />
          <h2 className="text-2xl font-bold">{title}</h2>
        </div>
        {seeAllHref && (
          <Button variant="link" asChild>
              <Link href={seeAllHref}>See All &gt;</Link>
          </Button>
        )}
      </div>
      <Carousel
        opts={{
          align: 'start',
          slidesToScroll: 'auto',
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {movies.map((movie, index) => (
            <CarouselItem key={movie.id} className="pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6">
              <MovieCard movie={movie} priority={index < 5} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
