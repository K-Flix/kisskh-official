'use client';

import { useState } from 'react';
import type { Season } from '@/lib/types';
import { SeasonSelector } from '@/components/season-selector';
import { EpisodeCard } from '@/components/episode-card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

interface EpisodeListProps {
  seasons: Season[];
  onEpisodePlay: (season: number, episode: number) => void;
}

export function EpisodeList({ seasons, onEpisodePlay }: EpisodeListProps) {
  const [selectedSeason, setSelectedSeason] = useState<Season | undefined>(seasons[0]);

  const handleSeasonChange = (seasonNumber: string) => {
    const season = seasons.find(s => s.season_number.toString() === seasonNumber);
    setSelectedSeason(season);
  };

  if (!seasons || seasons.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold font-headline flex items-center">
            <span className="w-1 h-7 bg-primary mr-3"></span>
            Episodes
        </h2>
        <SeasonSelector seasons={seasons} onSeasonChange={handleSeasonChange} />
      </div>
      {selectedSeason && (
        <Carousel opts={{ align: 'start', loop: false }}>
          <CarouselContent>
            {selectedSeason.episodes.map((episode) => (
              <CarouselItem key={episode.id} className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                <div onClick={() => onEpisodePlay(selectedSeason.season_number, episode.episode_number)}>
                    <EpisodeCard episode={episode} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="ml-12" />
          <CarouselNext className="mr-12" />
        </Carousel>
      )}
    </div>
  );
}
