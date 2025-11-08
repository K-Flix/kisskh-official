'use client';

import { notFound } from 'next/navigation';
import { getShowById } from '@/lib/data';
import { ShowHero } from '@/components/show-hero';
import { EpisodeList } from '@/components/episode-list';
import { MovieCarousel } from '@/components/movie-carousel';
import { ActorCard } from '@/components/actor-card';
import { SimilarShows } from '@/components/similar-shows';
import { useState, useEffect } from 'react';
import type { ShowDetails } from '@/lib/types';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { ArrowLeft, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ShowPageProps {
  params: {
    id: string;
  };
}

interface PlayerState {
  season: number;
  episode: number;
}

export default function ShowPage({ params }: ShowPageProps) {
  const [show, setShow] = useState<ShowDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [playerState, setPlayerState] = useState<PlayerState | null>(null);

  useEffect(() => {
    const fetchShow = async () => {
      const showId = parseInt(params.id, 10);
      if (isNaN(showId)) {
        notFound();
        return;
      }
      try {
        setLoading(true);
        const fetchedShow = await getShowById(showId);
        if (!fetchedShow) {
          notFound();
          return;
        }
        setShow(fetchedShow);
      } catch (error) {
        console.error('Failed to fetch show details:', error);
        notFound();
      } finally {
        setLoading(false);
      }
    };
    fetchShow();
  }, [params.id]);

  const handlePlay = (season: number, episode: number) => {
    setPlayerState({ season, episode });
  };
  
  const handlePlayFirstEpisode = () => {
    if (show && show.seasons.length > 0 && show.seasons[0].episodes.length > 0) {
        const firstSeason = show.seasons[0];
        const firstEpisode = firstSeason.episodes[0];
        handlePlay(firstSeason.season_number, firstEpisode.episode_number);
    }
  }


  if (loading || !show) {
    return <ShowPageSkeleton />;
  }
  
  const videoUrl = playerState
    ? `https://vidstorm.ru/tv/${show.id}/${playerState.season}/${playerState.episode}`
    : '';

  return (
    <div className="flex flex-col">
       <div className="relative h-[56.25vw] max-h-[80vh] w-full bg-black">
        {!playerState ? (
          <>
            <Link href="/tv" className="absolute top-4 left-4 z-20 bg-background/50 p-2 rounded-full hover:bg-background/80 transition-colors">
              <ArrowLeft className="w-6 h-6"/>
              <span className="sr-only">Back to TV shows</span>
            </Link>
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
          </>
        ) : (
            <div className="w-full h-full">
                <iframe
                    src={videoUrl}
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                ></iframe>
                <Button onClick={() => setPlayerState(null)} variant="ghost" size="icon" className="absolute top-4 right-4 z-20 bg-background/50 hover:bg-background/80">
                    <X/>
                    <span className="sr-only">Close player</span>
                </Button>
            </div>
        )}
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
                    <ActorCard key={member.name} actor={member} />
                ))}
            </div>
        </div>
        
        <SimilarShows movie={show} />

        {show.similar && show.similar.length > 0 && (
            <MovieCarousel title="You may also like" movies={show.similar} />
        )}
      </div>
    </div>
  );
}

function ShowPageSkeleton() {
    return (
      <div className="flex flex-col">
        <div className="relative h-[56.25vw] max-h-[80vh] w-full bg-black">
          <Skeleton className="w-full h-full" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/30 to-transparent" />
          <div className="relative z-10 flex flex-col justify-end h-full container pb-8 md:pb-16 space-y-4">
            <Skeleton className="h-14 md:h-20 w-3/4 max-w-sm" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-20" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-24" />
            </div>
            <Skeleton className="h-12 w-full max-w-2xl" />
            <div className="flex gap-4">
              <Skeleton className="h-12 w-32" />
              <Skeleton className="h-12 w-12" />
            </div>
          </div>
        </div>
        <div className="container py-8 md:py-12 space-y-12">
            <Skeleton className="h-8 w-40 mb-4" />
            <div className="space-y-4">
                <Skeleton className="h-10 w-[180px]" />
                <div className='flex gap-4'>
                    <Skeleton className="h-40 w-1/4" />
                    <Skeleton className="h-40 w-1/4" />
                    <Skeleton className="h-40 w-1/4" />
                    <Skeleton className="h-40 w-1/4" />
                </div>
            </div>
          <div>
            <Skeleton className="h-8 w-40 mb-4" />
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4 sm:gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center text-center">
                  <Skeleton className="w-24 h-24 sm:w-32 sm:h-32 rounded-full" />
                  <Skeleton className="h-5 w-20 mt-2" />
                  <Skeleton className="h-4 w-16 mt-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }
