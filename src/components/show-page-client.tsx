
'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { ShowDetails } from '@/lib/types';
import { EpisodeList } from '@/components/episode-list';
import { MovieCarousel } from '@/components/movie-carousel';
import { ActorCard } from '@/components/actor-card';
import { ShowHero } from './show-hero';
import { X } from 'lucide-react';

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

  const handleClosePlayer = () => {
    setPlayerState(null);
  }
  
  const handlePlayFirstEpisode = () => {
    if (show && show.seasons.length > 0) {
      const firstSeasonWithEpisodes = show.seasons.find(s => s.season_number > 0 && s.episodes.length > 0);
      const seasonToPlay = firstSeasonWithEpisodes || show.seasons.find(s => s.episodes.length > 0);

      if (seasonToPlay && seasonToPlay.episodes.length > 0) {
        const firstEpisode = seasonToPlay.episodes[0];
        handlePlay(seasonToPlay.season_number, firstEpisode.episode_number);
      }
    }
  };

  const videoUrl = playerState
    ? `https://vidstorm.ru/tv/${show.id}/${playerState.season}/${playerState.episode}`
    : '';

  return (
    <div className="text-white">
      <div className="relative h-[60vh] md:h-[90vh] w-full">
        <Image
          src={show.backdrop_path}
          alt={`Backdrop for ${show.title}`}
          fill
          priority
          className="object-cover object-center"
          data-ai-hint="tv show backdrop"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-black/20" />
        
        {playerState ? (
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
            <ShowHero show={show} onPlayClick={handlePlayFirstEpisode} />
        )}
      </div>
      
      <div className="container py-8 space-y-12">
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
