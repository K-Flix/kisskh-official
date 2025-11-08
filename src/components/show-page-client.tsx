
'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { ShowDetails } from '@/lib/types';
import { EpisodeList } from '@/components/episode-list';
import { MovieCarousel } from '@/components/movie-carousel';
import { ActorCard } from '@/components/actor-card';
import { ShowHero } from './show-hero';
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

  return (
    <>
      <div className="relative h-[60vh] md:h-[80vh] w-full">
        {playerState ? (
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
                src={show.backdrop_path}
                alt={`Backdrop for ${show.title}`}
                fill
                priority
                className="object-cover object-top"
                data-ai-hint="tv show backdrop"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />
            </>
        )}
        <ShowHero show={show} onPlayClick={handlePlayFirstEpisode} />
    </div>

      <div className="container py-8 md:py-12 space-y-12">
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
    </>
  );
}
