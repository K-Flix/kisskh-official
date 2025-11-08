import Image from 'next/image';
import Link from 'next/link';
import type { Movie } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { PlayCircle } from 'lucide-react';

interface HeroSectionProps {
  movie: Movie;
}

export function HeroSection({ movie }: HeroSectionProps) {
  return (
    <div className="relative h-[60vh] md:h-[80vh] w-full">
      <Image
        src={movie.backdrop_path}
        alt={`Backdrop for ${movie.title}`}
        fill
        priority
        className="object-cover object-top"
        data-ai-hint="movie backdrop"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent" />
      <div className="relative z-10 flex flex-col justify-end h-full container pb-12 md:pb-24 space-y-4">
        
        {movie.logo_path ? (
          <div className="relative w-full max-w-sm h-24 md:h-32">
            <Image
              src={movie.logo_path}
              alt={`${movie.title} logo`}
              fill
              className="object-contain"
              data-ai-hint="movie logo"
            />
          </div>
        ) : (
          <h1 className="text-4xl md:text-6xl font-bold font-headline text-white drop-shadow-lg">
            {movie.title}
          </h1>
        )}

        <p className="max-w-xl text-foreground/80 md:text-lg drop-shadow-md line-clamp-3">
          {movie.overview}
        </p>
        <div className="flex gap-4">
          <Button asChild size="lg">
            <Link href={`/movie/${movie.id}`}>
              <PlayCircle className="mr-2" />
              Watch Now
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
