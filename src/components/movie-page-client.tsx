
'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { MovieDetails } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, Calendar, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WatchlistButton } from '@/components/watchlist-button';
import { ActorCard } from '@/components/actor-card';
import { MovieCarousel } from '@/components/movie-carousel';
import Link from 'next/link';

interface MoviePageClientProps {
  movie: MovieDetails;
}

export function MoviePageClient({ movie }: MoviePageClientProps) {
  const [showPlayer, setShowPlayer] = useState(false);

  const movieYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
  const runtimeHours = movie.runtime ? Math.floor(movie.runtime / 60) : 0;
  const runtimeMinutes = movie.runtime ? movie.runtime % 60 : 0;
  const videoUrl = `https://vidstorm.ru/movie/${movie.id}`;

  return (
    <>
      <div className="relative h-[60vh] md:h-[80vh] w-full">
        {showPlayer ? (
            <div className='w-full h-full bg-black flex items-center justify-center'>
                 <div className="container h-full">
                    <iframe
                        src={videoUrl}
                        allow="autoplay; encrypted-media; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full border-0"
                    ></iframe>
                </div>
            </div>
        ) : (
            <>
            <Image
                src={movie.backdrop_path}
                alt={`Backdrop for ${movie.title}`}
                fill
                priority
                className="object-cover object-top"
                data-ai-hint="movie backdrop"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />
            </>
        )}

          <div className="absolute inset-0 z-10 flex flex-col justify-end h-full container pb-8 md:pb-16 space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold font-headline text-white drop-shadow-lg max-w-2xl">
              {movie.title}
            </h1>

            <div className="flex items-center gap-4 text-sm text-foreground/80">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span>{movie.vote_average.toFixed(1)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{movieYear}</span>
              </div>
              {movie.runtime > 0 && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{runtimeHours}h {runtimeMinutes}m</span>
                </div>
              )}
                {movie.genres.slice(0, 2).map((genre) => (
                    <Badge key={genre.id} variant="outline" className="backdrop-blur-sm bg-transparent border-white/50 text-white">{genre.name}</Badge>
                ))}
            </div>

            <p className="max-w-xl text-foreground/80 md:text-base drop-shadow-md line-clamp-3">
              {movie.overview}
            </p>
            <div className="flex flex-wrap gap-2 md:gap-4 items-center">
              <Button onClick={() => setShowPlayer(true)} size="lg" className="bg-white text-black hover:bg-white/90">
                <Play className="mr-2" />
                Play
              </Button>
              <WatchlistButton movie={movie} />
               <Button variant="outline" className="bg-transparent border-white/50 hover:bg-white/10 text-white">
                Episodes
              </Button>
               <Button variant="outline" className="bg-transparent border-white/50 hover:bg-white/10 text-white">
                Similar
              </Button>
            </div>
          </div>
      </div>
      

      <div className="container py-8 md:py-12 space-y-12">
        <div className="my-8">
            <Link href="#">
                <Image src="https://picsum.photos/seed/meme-ad/1200/200" width={1200} height={200} alt="Ad banner" className="w-full h-auto rounded-lg" data-ai-hint="advertisement banner" />
            </Link>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold mb-4 font-headline flex items-center">
            <span className="w-1 h-7 bg-primary mr-3"></span>
            Actors
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4 sm:gap-6">
            {movie.cast.slice(0, 12).map((member) => (
              <ActorCard key={member.credit_id} actor={member} />
            ))}
          </div>
        </div>
        
        {movie.similar && movie.similar.length > 0 && (
          <MovieCarousel title="You may like" movies={movie.similar} />
        )}
      </div>
    </>
  );
}
