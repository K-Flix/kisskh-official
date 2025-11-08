
'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { ShowDetails } from '@/lib/types';
import { EpisodeList } from '@/components/episode-list';
import { MovieCarousel } from '@/components/movie-carousel';
import { ActorCard } from '@/components/actor-card';
import { ShowHero } from './show-hero';
import { X } from 'lucide-react';
import { Dialog, DialogContent } from './ui/dialog';

interface ShowPageClientProps {
  show: ShowDetails;
}

interface PlayerState {
  season: number;
  episode: number;
}

export function ShowPageClient({ show }: ShowPageClientProps) {
  const [playerState, setPlayerState] = useState<PlayerState | null>(null);
  const [showTrailer, setShowTrailer] = useState(false);

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

  const trailerUrl = show.trailer_url ? `${show.trailer_url}?autoplay=1&rel=0` : '';

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
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/75 backdrop-blur-sm">
            <div className="w-full h-full max-w-6xl aspect-video relative">
              <iframe
                  src={videoUrl}
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0 rounded-lg"
              ></iframe>
              <button 
                onClick={handleClosePlayer} 
                className="absolute -top-10 right-0 text-white hover:text-primary transition-colors"
                aria-label="Close player"
              >
                <X className="w-8 h-8" />
              </button>
            </div>
          </div>
        ) : (
            <ShowHero show={show} onPlayClick={handlePlayFirstEpisode} onTrailerClick={() => setShowTrailer(true)} />
        )}
      </div>
      
      <div className="container py-8 space-y-12">
        <EpisodeList seasons={show.seasons} onEpisodePlay={handlePlay} />
        
        {show.cast.length > 0 && <ActorCard actors={show.cast} />}
        
        {show.similar && show.similar.length > 0 && (
          <MovieCarousel title="You may also like" movies={show.similar} />
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
