
'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { MovieDetails } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WatchlistButton } from '@/components/watchlist-button';
import { ActorCard } from '@/components/actor-card';
import { MovieCarousel } from '@/components/movie-carousel';
import { ShowHero } from './show-hero';

interface MoviePageClientProps {
  movie: MovieDetails;
}

export function MoviePageClient({ movie }: MoviePageClientProps) {
  const [showPlayer, setShowPlayer] = useState(false);

  const movieYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
  const videoUrl = `https://vidstorm.ru/movie/${movie.id}`;

  return (
    <div className="text-white">
      <div className="relative h-[50vh] md:h-[75vh] w-full">
        <Image
          src={movie.backdrop_path}
          alt={`Backdrop for ${movie.title}`}
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-black/20" />
        {showPlayer ? (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50">
                <div className="w-full h-full max-w-4xl aspect-video">
                <iframe
                    src={videoUrl}
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                ></iframe>
                </div>
          </div>
        ) : (
          <ShowHero show={movie} onPlayClick={() => setShowPlayer(true)} />
        )}
      </div>

      <div className="container py-8 space-y-12">
        <div>
          <h2 className="text-2xl font-bold mb-4 font-headline flex items-center">
            <span className="w-1 h-7 bg-primary mr-3"></span>
            Cast
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4 sm:gap-6">
            {movie.cast.slice(0, 12).map((member) => (
              <ActorCard key={member.credit_id} actor={member} />
            ))}
          </div>
        </div>

        {movie.similar && movie.similar.length > 0 && (
          <MovieCarousel title="You may also like" movies={movie.similar} />
        )}
      </div>
    </div>
  );
}
