
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
import { Button } from './ui/button';

interface ShowPageClientProps {
  show: ShowDetails;
}

interface PlayerState {
  season: number;
  episode: number;
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

export function ShowPageClient({ show }: ShowPageClientProps) {
  const [playerState, setPlayerState] = useState<PlayerState | null>(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [selectedServer, setSelectedServer] = useState('Vidstorm');

  const handlePlay = (season: number, episode: number) => {
    setPlayerState({ season, episode });
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const getPlayerUrl = () => {
    if (!playerState) return '';

    const id = show.id;
    const { season: seasonNum, episode: episodeNum } = playerState;

    switch (selectedServer) {
        case 'Vidstorm':
            return `https://vidstorm.ru/tv/${id}/${seasonNum}/${episodeNum}`;
        case 'VidSrcV2':
            return `https://vidsrc.cc/v2/embed/tv/${id}/${seasonNum}/${episodeNum}?autoPlay=true`;
        case 'Videasy':
            return `https://player.videasy.net/tv/${id}/${seasonNum}/${episodeNum}?autoplay=true`;
        case 'VidSrcMe':
            return `https://vidsrcme.ru/embed/tv?tmdb=${id}&season=${seasonNum}&episode=${episodeNum}`;
        case 'VidPlus':
            return `https://player.vidplus.to/embed/tv/${id}/${seasonNum}/${episodeNum}?autoplay=true`;
        case 'MoviesAPI':
            return `https://moviesapi.club/tv/${id}-${seasonNum}-${episodeNum}`;
        case 'VidLink':
            return `https://vidlink.pro/tv/${id}/${seasonNum}/${episodeNum}`;
        default:
            return `https://vidstorm.ru/tv/${id}/${seasonNum}/${episodeNum}`;
    }
  };

  const videoUrl = getPlayerUrl();
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
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/75 backdrop-blur-sm p-4 py-8">
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
                        onClick={handleClosePlayer} 
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
            <ShowHero show={show} onPlayClick={handlePlayFirstEpisode} onTrailerClick={() => setShowTrailer(true)} />
        )}
      </div>
      
      <div className="container py-8 space-y-12">
        <EpisodeList 
          seasons={show.seasons} 
          onEpisodePlay={handlePlay} 
          currentEpisode={playerState ? { season: playerState.season, episode: playerState.episode } : undefined}
        />
        
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
