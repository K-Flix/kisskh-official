
'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { MovieDetails } from '@/lib/types';
import { ActorCard } from '@/components/actor-card';
import { MovieCarousel } from '@/components/movie-carousel';
import { ShowHero } from './show-hero';
import { X } from 'lucide-react';
import { Dialog, DialogContent } from './ui/dialog';

interface MoviePageClientProps {
  movie: MovieDetails;
}

export function MoviePageClient({ movie }: MoviePageClientProps) {
  const [showPlayer, setShowPlayer] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);

  const videoUrl = `https://vidstorm.ru/movie/${movie.id}`;
  const trailerUrl = movie.trailer_url ? `${movie.trailer_url}?autoplay=1&rel=0` : '';

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
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/75 backdrop-blur-sm">
                <div className="w-full h-full max-w-6xl aspect-video relative">
                <iframe
                    src={videoUrl}
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0 rounded-lg"
                ></iframe>
                <button 
                  onClick={() => setShowPlayer(false)} 
                  className="absolute -top-10 right-0 text-white hover:text-primary transition-colors"
                  aria-label="Close player"
                >
                    <X className="w-8 h-8" />
                </button>
                </div>
          </div>
        ) : (
          <ShowHero show={movie} onPlayClick={() => setShowPlayer(true)} onTrailerClick={() => setShowTrailer(true)} />
        )}
      </div>

      <div className="container py-8 space-y-12">
        {movie.cast.length > 0 && <ActorCard actors={movie.cast} />}

        {movie.similar && movie.similar.length > 0 && (
          <MovieCarousel title="You may also like" movies={movie.similar} />
        )}
      </div>

        <Dialog open={showTrailer} onOpenChange={setShowTrailer}>
            <DialogContent className="bg-black border-0 p-0 max-w-4xl w-full aspect-video">
                 <iframe
                    src={trailerUrl}
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0 rounded-lg"
                ></iframe>
            </DialogContent>
        </Dialog>
    </div>
  );
}
