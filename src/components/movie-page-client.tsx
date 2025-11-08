
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
import { Badge } from './ui/badge';

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
  
  const handlePlay = () => {
    setShowPlayer(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  return (
    <div className="text-white">
      {showPlayer ? (
        <div className="w-full">
            <div className="relative aspect-video w-full max-w-4xl mx-auto md:mt-8">
              <iframe
                src={videoUrl}
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0 md:rounded-lg bg-black"
                key={selectedServer}
              ></iframe>
              <button
                onClick={() => setShowPlayer(false)}
                className="absolute top-2 right-2 md:-top-3 md:-right-3 z-10 text-white bg-background/50 rounded-full p-1 hover:bg-background/80 transition-colors"
                aria-label="Close player"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="container max-w-4xl mx-auto mt-4">
              <div className="flex flex-wrap items-center gap-2 p-2 bg-secondary/50 rounded-lg">
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
      ) : (
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
            
            <ShowHero show={movie} onPlayClick={handlePlay} onTrailerClick={() => setShowTrailer(true)}>
                {'runtime' in movie && movie.runtime ? (
                    <Badge variant="outline" className="backdrop-blur-sm bg-black/20 border-white/50 text-white">{movie.runtime} min</Badge>
                ) : null}
            </ShowHero>
        </div>
      )}

      <div className="container py-8 space-y-12">
        <ActorCard actors={movie.cast} />

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
