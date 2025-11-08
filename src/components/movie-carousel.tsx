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
}

export function MovieCarousel({ title, movies }: MovieCarouselProps) {
  if (!movies || movies.length === 0) return null;
  
  return (
    <div className="space-y-4">
      <div className='flex justify-between items-center'>
        <h2 className="text-2xl font-bold font-headline flex items-center">
            <span className="w-1 h-7 bg-primary mr-3"></span>
            {title}
        </h2>
        <Button variant="link" asChild>
            <Link href="#">See All &gt;</Link>
        </Button>
      </div>
      <Carousel
        opts={{
          align: 'start',
          loop: false,
        }}
        className="w-full"
      >
        <CarouselContent>
          {movies.map((movie) => (
            <CarouselItem key={movie.id} className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/6">
              <MovieCard movie={movie} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="ml-12" />
        <CarouselNext className="mr-12" />
      </Carousel>
    </div>
  );
}
