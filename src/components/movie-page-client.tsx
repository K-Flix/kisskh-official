
'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { MovieDetails } from '@/lib/types';
import { ActorCard } from '@/components/actor-card';
import { MovieCarousel } from '@/components/movie-carousel';
import { ShowHero } from './show-hero';
import { X } from 'lucide-react';
import { Dialog, DialogContent } from './ui/dialog';
import { Button } from './ui/button';

interface MoviePageClientProps {
  movie: MovieDetails;
}

const servers = [
    { name: 'Vidstorm', displayName: 'Vidstorm' },
    { name: 'VidSrcV2', displayName: 'VidSrc' },
    { name: 'Videasy', displayName: 'Videasy' },
    { name: 'VidSrcMe', displayName: 'VidSrcMe' },
    { name: 'VidPlus', displayName: 'VidPlus' },
    { name: 'MoviesAPI', displayName: 'MoviesAPI' },
    { name: 'VidLink', displayName: 'VidLink' }
  ];

export function MoviePageClient({ movie }: MoviePageClientProps) {
  const [showPlayer, setShowPlayer] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [selectedServer, setSelectedServer] = useState('Vidstorm');

  const getPlayerUrl = () => {
    const id = movie.id;
    const media_type = 'movie';

    switch (selectedServer) {
        case 'Vidstorm':
            return `https://vidstorm.ru/movie/${id}`;
        case 'VidSrcV2':
            return `https://vidsrc.cc/v2/embed/movie/${id}?autoPlay=true`;
        case 'Videasy':
            return `https://player.videasy.net/movie/${id}?autoplay=true`;
        case 'VidSrcMe':
            return `https://vidsrcme.ru/embed/movie?tmdb=${id}`;
        case 'VidPlus':
            return `https://player.vidplus.to/embed/movie/${id}?autoplay=true`;
        case 'MoviesAPI':
            return `https://moviesapi.club/movie/${id}`;
        case 'VidLink':
            return `https://vidlink.pro/movie/${id}`;
        default:
            return `https://vidstorm.ru/movie/${id}`;
    }
  };

  const videoUrl = getPlayerUrl();
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
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/75 backdrop-blur-sm p-4">
                <div className="w-full max-w-6xl">
                    <div className="w-full aspect-video relative">
                        <iframe
                            src={videoUrl}
                            allow="autoplay; encrypted-media; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full border-0 rounded-lg bg-black"
                            key={selectedServer}
                        ></iframe>
                        <button 
                          onClick={() => setShowPlayer(false)} 
                          className="absolute -top-2 -right-2 md:-top-4 md:-right-4 z-10 text-white bg-background/50 rounded-full p-1 hover:bg-background/80 transition-colors"
                          aria-label="Close player"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                     <div className="mt-4 p-2 bg-black/30 rounded-lg backdrop-blur-sm">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-semibold text-gray-300 mr-2 shrink-0">Servers:</span>
                            {servers.map(({ name, displayName }) => (
                                <Button
                                    key={name}
                                    onClick={() => setSelectedServer(name)}
                                    size="sm"
                                    variant={selectedServer === name ? 'default' : 'secondary'}
                                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                                        selectedServer === name
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-zinc-700/80 hover:bg-zinc-600'
                                    }`}
                                >
                                    {displayName}
                                </Button>
                            ))}
                        </div>
                    </div>
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
