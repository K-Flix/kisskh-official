
'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { MovieDetails } from '@/lib/types';
import { ActorCard } from '@/components/actor-card';
import { MovieCarousel } from '@/components/movie-carousel';
import { ShowHero } from './show-hero';
import { X } from 'lucide-react';

interface MoviePageClientProps {
  movie: MovieDetails;
}

export function MoviePageClient({ movie }: MoviePageClientProps) {
  const [showPlayer, setShowPlayer] = useState(false);

  const handleClosePlayer = () => {
    setShowPlayer(false);
  }

  const videoUrl = `https://vidstorm.ru/movie/${movie.id}`;

  return (
    <div className="text-white">
      <div className="relative h-[60vh] md:h-[90vh] w-full">
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
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/75 backdrop-blur-lg">
                <div className="w-full h-full max-w-6xl aspect-video relative">
                <iframe
                    src={videoUrl}
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                ></iframe>
                <button onClick={handleClosePlayer} className="absolute -top-10 right-0 text-white hover:text-primary transition-colors">
                    <X className="w-8 h-8" />
                    <span className="sr-only">Close player</span>
                </button>
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
