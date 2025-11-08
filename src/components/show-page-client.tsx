
'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { ShowDetails } from '@/lib/types';
import { EpisodeList } from '@/components/episode-list';
import { MovieCarousel } from '@/components/movie-carousel';
import { ActorCard } from '@/components/actor-card';
import { Badge } from '@/components/ui/badge';
import { Star, Play, Film } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WatchlistButton } from '@/components/watchlist-button';

interface ShowPageClientProps {
  show: ShowDetails;
}

interface PlayerState {
  season: number;
  episode: number;
}

export function ShowPageClient({ show }: ShowPageClientProps) {
  const [playerState, setPlayerState] = useState<PlayerState | null>(null);

  const handlePlay = (season: number, episode: number) => {
    setPlayerState({ season, episode });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handlePlayFirstEpisode = () => {
    if (show && show.seasons.length > 0) {
      const firstSeason = show.seasons.find(s => s.season_number > 0) || show.seasons[0];
      if (firstSeason && firstSeason.episodes.length > 0) {
        const firstEpisode = firstSeason.episodes[0];
        handlePlay(firstSeason.season_number, firstEpisode.episode_number);
      }
    }
  };

  const videoUrl = playerState
    ? `https://vidstorm.ru/tv/${show.id}/${playerState.season}/${playerState.episode}`
    : '';
  
  const showYear = show.release_date ? new Date(show.release_date).getFullYear() : 'N/A';


  return (
    <div className="text-white">
      <div className="relative h-[70vh] w-full">
        <div className="absolute inset-0">
          <Image
            src={show.backdrop_path}
            alt={`Backdrop for ${show.title}`}
            fill
            priority
            className="object-cover object-center"
            data-ai-hint="tv show backdrop"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background to-transparent" />
        </div>
        
        <div className="relative z-10 flex h-full flex-col justify-end container pb-12">
          <div className="w-full max-w-lg space-y-4">
            {show.logo_path ? (
              <div className="relative h-24 w-full max-w-sm">
                <Image
                  src={show.logo_path}
                  alt={`${show.title} logo`}
                  fill
                  className="object-contain object-left-bottom"
                />
              </div>
            ) : (
              <h1 className="text-4xl md:text-5xl font-bold font-headline">
                {show.title}
              </h1>
            )}

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1 text-yellow-400">
                <Star className="h-4 w-4 fill-current" />
                <span>{show.vote_average.toFixed(1)}</span>
              </div>
              <span>{showYear}</span>
              {show.genres.slice(0, 2).map((genre) => (
                <Badge key={genre.id} variant="outline" className="border-white/20 bg-white/10 text-white">
                  {genre.name}
                </Badge>
              ))}
            </div>

            <p className="text-sm text-foreground/80 line-clamp-3">
              {show.overview}
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <Button onClick={handlePlayFirstEpisode} size="lg" className="bg-white text-black hover:bg-white/90">
                <Play className="mr-2 h-5 w-5 fill-black" />
                Play
              </Button>
              <WatchlistButton movie={show} />
              <Button variant="outline" className="border-white/20 bg-white/10 backdrop-blur-sm">
                <Film className="mr-2 h-4 w-4" />
                Trailer
              </Button>
              <Button variant="outline" className="border-white/20 bg-white/10 backdrop-blur-sm">
                Episodes
              </Button>
              <Button variant="outline" className="border-white/20 bg-white/10 backdrop-blur-sm">
                Similar
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container py-8 space-y-12">
        {playerState && (
            <div className="w-full aspect-video bg-black rounded-lg overflow-hidden">
                <iframe
                    src={videoUrl}
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                ></iframe>
            </div>
        )}

        <EpisodeList seasons={show.seasons} onEpisodePlay={handlePlay} />
        
        <div>
          <h2 className="text-2xl font-bold mb-4 font-headline flex items-center">
              <span className="w-1 h-7 bg-primary mr-3"></span>
              Cast
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4 sm:gap-6">
              {show.cast.slice(0, 12).map((member) => (
              <ActorCard key={member.credit_id} actor={member} />
              ))}
          </div>
        </div>
        
        {show.similar && show.similar.length > 0 && (
          <MovieCarousel title="You may also like" movies={show.similar} />
        )}
      </div>
    </div>
  );
}
