
'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { ShowDetails } from '@/lib/types';
import { EpisodeList } from '@/components/episode-list';
import { MovieCarousel } from '@/components/movie-carousel';
import { ActorCard } from '@/components/actor-card';
import { Badge } from '@/components/ui/badge';
import { Star, Calendar, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WatchlistButton } from '@/components/watchlist-button';
import Link from 'next/link';

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
    <div className="relative">
      <div className="absolute top-0 left-0 w-full h-[60vh] -z-10">
           <Image
              src={show.backdrop_path}
              alt={`Backdrop for ${show.title}`}
              fill
              priority
              className="object-cover object-center"
              data-ai-hint="tv show backdrop"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-l from-background via-transparent to-transparent" />
      </div>

      <div className="container pt-48 md:pt-56 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
            <div className="space-y-3">
                <h1 className="text-4xl font-bold font-headline">
                    {show.title}
                </h1>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span>{show.vote_average.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{showYear}</span>
                    </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                    {show.genres.map((genre) => (
                        <Badge key={genre.id} variant="outline">{genre.name}</Badge>
                    ))}
                </div>
            </div>


            <div className="flex flex-wrap gap-2 md:gap-4 items-center">
                <Button onClick={handlePlayFirstEpisode} size="lg">
                <Play className="mr-2" />
                Play
                </Button>
                <WatchlistButton movie={show} />
                <Button variant="outline" size="lg">
                Episodes
                </Button>
                <Button variant="outline" size="lg">
                Similar
                </Button>
            </div>

            <p className="text-muted-foreground md:text-base leading-relaxed">
                {show.overview}
            </p>

            </div>
        </div>

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

        <div className="space-y-12">
            <EpisodeList seasons={show.seasons} onEpisodePlay={handlePlay} />
            
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
    </div>
  );
}
