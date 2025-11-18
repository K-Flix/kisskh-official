
'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Movie, Show } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Play, Info } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import Autoplay from "embla-carousel-autoplay"
import * as React from 'react';

interface HeroSectionProps {
  movies: (Movie | Show)[];
}

function HeroContent({ movie }: { movie: Movie | Show }) {
  return (
    <>
      {movie.logo_path ? (
        <div className="relative w-full max-w-sm h-24 md:h-32 -ml-2">
            <Image
            src={movie.logo_path}
            alt={`${movie.title} logo`}
            fill
            priority
            className="object-contain object-left-bottom"
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
        <Button asChild size="lg" className="bg-white text-black hover:bg-white/90">
            <Link href={movie.media_type === 'tv' ? `/tv/${movie.id}` : `/movie/${movie.id}`}>
            <Play className="mr-2 fill-black" />
            Play
            </Link>
        </Button>
        <Button asChild size="lg" variant="secondary" className="bg-black/30 text-white hover:bg-black/50 border border-white/20 backdrop-blur-sm">
             <Link href={movie.media_type === 'tv' ? `/tv/${movie.id}` : `/movie/${movie.id}`}>
            <Info className="mr-2" />
            See More
            </Link>
        </Button>
        </div>
    </>
  )
}


export function HeroSection({ movies }: HeroSectionProps) {
  const plugin = React.useRef(
    Autoplay({ delay: 10000, stopOnInteraction: true })
  )

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {movies.map((movie, index) => (
          <CarouselItem key={movie.id}>
            {/* Mobile Layout */}
            <div className="md:hidden relative h-[50vh] w-full">
              <Image
                src={movie.backdrop_path}
                alt={`Backdrop for ${movie.title}`}
                fill
                priority={index === 0}
                className="object-cover object-top"
                data-ai-hint="movie backdrop"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
              <div className="relative z-10 flex flex-col justify-end h-full container pb-8">
                <div className="max-w-screen-md space-y-4">
                  <HeroContent movie={movie} />
                </div>
              </div>
            </div>

            {/* Desktop Layout: Content over backdrop image */}
            <div className="hidden md:block relative h-[100dvh] w-full">
                <Image
                    src={movie.backdrop_path}
                    alt={`Backdrop for ${movie.title}`}
                    fill
                    priority={index === 0}
                    className="object-cover object-top"
                    data-ai-hint="movie backdrop"
                />
                 <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                <div className="relative z-10 flex flex-col justify-end h-full container pb-24">
                    <div className="max-w-screen-md space-y-4">
                        <HeroContent movie={movie} />
                    </div>
                </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
