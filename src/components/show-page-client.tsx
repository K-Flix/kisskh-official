
'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import type { ShowDetails } from '@/lib/types';
import { EpisodeList } from '@/components/episode-list';
import { MovieCarousel } from '@/components/movie-carousel';
import { ActorCard } from '@/components/actor-card';
import { ShowHero } from './show-hero';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { Dialog, DialogContent } from './ui/dialog';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ShowPageClientProps {
  show: ShowDetails;
}

interface PlayerState {
  season: number;
  episode: number;
}

const servers = [
    { name: 'Vidstorm', displayName: 'Primary' },
    { name: 'VidSrcV2', displayName: 'Alternate 1' },
    { name: 'Videasy', displayName: 'Alternate 2' },
    { name: 'VidSrcMe', displayName: 'Alternate 3' },
    { name: 'VidPlus', displayName: 'Alternate 4' },
    { name: 'MoviesAPI', displayName: 'Alternate 5' },
    { name: 'VidLink', displayName: 'Alternate 6' }
  ];

export function ShowPageClient({ show }: ShowPageClientProps) {
  const [playerState, setPlayerState] = useState<PlayerState | null>(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [selectedServer, setSelectedServer] = useState('Vidstorm');
  const episodesSectionRef = useRef<HTMLDivElement>(null);
  const similarsSectionRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handlePlay = (season: number, episode: number) => {
    setPlayerState({ season, episode });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handlePlayFirstEpisode = () => {
    if (show && show.seasons.length > 0) {
      const firstSeasonWithEpisodes = show.seasons.find(s => s.season_number > 0 && s.episodes.length > 0);
      const seasonToPlay = firstSeasonWithEpisodes || show.seasons.find(s => s.episodes.length > 0);

      if (seasonToPlay && seasonToPlay.episodes.length > 0) {
        // Find first released episode
        const firstReleasedEpisode = seasonToPlay.episodes.find(ep => ep.air_date && new Date(ep.air_date) <= new Date());
        if (firstReleasedEpisode) {
            handlePlay(seasonToPlay.season_number, firstReleasedEpisode.episode_number);
        }
      }
    }
  };

  const handleScrollTo = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
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
        <div className="relative w-full">
            {playerState ? (
                <div className="relative w-full">
                    <div className="relative aspect-video w-full">
                        <iframe
                            src={videoUrl}
                            allow="autoplay; encrypted-media; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full border-0 bg-black"
                            key={selectedServer}
                        ></iframe>
                    </div>
                     <div className="container mt-4">
                        <div className="grid grid-cols-1 items-center gap-4 bg-secondary/50 p-3 rounded-lg border-border/50">
                            <Select value={selectedServer} onValueChange={setSelectedServer}>
                                <SelectTrigger className="w-full bg-background border-0 focus:ring-2 focus:ring-primary">
                                    <SelectValue>
                                    Server: {servers.find(s => s.name === selectedServer)?.displayName}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    {servers.map(({ name, displayName }) => (
                                        <SelectItem key={name} value={name}>
                                            {displayName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="relative h-[50vh] md:h-[85vh] w-full">
                    <button onClick={() => router.back()} className="absolute top-6 left-4 md:left-6 z-50 flex items-center justify-center bg-black/30 p-2 rounded-full hover:bg-black/50 transition-colors">
                        <ArrowLeft className="w-6 h-6 text-white"/>
                        <span className="sr-only">Back</span>
                    </button>
                    <div className="absolute inset-0 h-full w-full">
                        <Image
                            src={show.backdrop_path}
                            alt={`Backdrop for ${show.title}`}
                            fill
                            priority
                            className="object-cover object-top"
                            data-ai-hint="tv show backdrop"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                    </div>
                    
                    <div className="relative z-10 flex h-full items-end">
                        <div className="container pb-8 md:pb-24">
                            <ShowHero show={show} onPlayClick={handlePlayFirstEpisode} onTrailerClick={() => setShowTrailer(true)}>
                                <Button onClick={() => handleScrollTo(episodesSectionRef)} variant="secondary" className="bg-black/20 text-white hover:bg-black/40 border border-white/20 backdrop-blur-sm px-4">
                                    Episodes
                                </Button>
                                <Button onClick={() => handleScrollTo(similarsSectionRef)} variant="secondary" className="bg-black/20 text-white hover:bg-black/40 border border-white/20 backdrop-blur-sm px-4">
                                    Similars
                                </Button>
                            </ShowHero>
                        </div>
                    </div>
                </div>
            )}
        </div>

        <div className="container py-8 space-y-12 md:mt-0">
            <div ref={episodesSectionRef}>
                <EpisodeList
                    showId={show.id}
                    seasons={show.seasons}
                    showBackdropPath={show.backdrop_path}
                    onEpisodePlay={handlePlay}
                    currentEpisode={playerState ? { season: playerState.season, episode: playerState.episode } : undefined}
                />
            </div>
            
            {show.cast && show.cast.length > 0 && <ActorCard actors={show.cast} />}
            
            <div ref={similarsSectionRef}>
                {show.similar && show.similar.length > 0 && (
                    <MovieCarousel title="Similars" movies={show.similar} />
                )}
            </div>
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
