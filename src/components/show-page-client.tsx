'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { ShowDetails } from '@/lib/types';
import { ShowHero } from '@/components/show-hero';
import { EpisodeList } from '@/components/episode-list';
import { MovieCarousel } from '@/components/movie-carousel';
import { ActorCard } from '@/components/actor-card';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  };
  
  const handlePlayFirstEpisode = () => {
    if (show && show.seasons.length > 0 && show.seasons[0].episodes.length > 0) {
      const firstSeason = show.seasons.find(s => s.season_number > 0) || show.seasons[0];
      const firstEpisode = firstSeason.episodes[0];
      handlePlay(firstSeason.season_number, firstEpisode.episode_number);
    }
  };

  const videoUrl = playerState
    ? `https://vidstorm.ru/tv/${show.id}/${playerState.season}/${playerState.episode}`
    : '';

  return (
    <div className="flex flex-col">
       <div className="relative h-[56.25vw] max-h-[80vh] w-full bg-background">
        {/* Player Overlay */}
        {playerState && (
           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
             <Button onClick={() => setPlayerState(null)} variant="ghost" size="icon" className="absolute top-4 right-4 z-50 bg-background/50 hover:bg-background/80 rounded-full h-12 w-12">
                <X className="h-8 w-8"/>
                <span className="sr-only">Close player</span>
              </Button>
            <div className="relative w-full max-w-6xl aspect-video rounded-lg overflow-hidden shadow-2xl mx-4">
              <iframe
                src={videoUrl}
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              ></iframe>
            </div>
          </div>
        )}

        {/* Backdrop and Show Info */}
        <Image
          src={show.backdrop_path}
          alt={`Backdrop for ${show.title}`}
          fill
          priority
          className="object-cover object-top"
          data-ai-hint="tv show backdrop"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/30 to-transparent" />
        <ShowHero show={show} onPlayClick={handlePlayFirstEpisode} />
      </div>

      <div className="container py-8 md:py-12 space-y-12">
        <EpisodeList seasons={show.seasons} onEpisodePlay={handlePlay} />
        
        <div>
          <h2 className="text-2xl font-bold mb-4 font-headline flex items-center">
            <span className="w-1 h-7 bg-primary mr-3"></span>
            Cast
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4 sm:gap-6">
            {show.cast.slice(0, 8).map((member) => (
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
