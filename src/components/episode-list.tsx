'use client';

import { useState } from 'react';
import type { Season } from '@/lib/types';
import { SeasonSelector } from '@/components/season-selector';
import { EpisodeCard } from '@/components/episode-card';
import { Input } from './ui/input';
import { Search } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';

interface EpisodeListProps {
  seasons: Season[];
  onEpisodePlay: (season: number, episode: number) => void;
}

export function EpisodeList({ seasons, onEpisodePlay }: EpisodeListProps) {
  const [selectedSeason, setSelectedSeason] = useState<Season | undefined>(seasons.find(s => s.season_number > 0) || seasons[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSeasonChange = (seasonNumber: string) => {
    const season = seasons.find(s => s.season_number.toString() === seasonNumber);
    setSelectedSeason(season);
  };

  if (!seasons || seasons.length === 0) {
    return null;
  }

  const filteredEpisodes = selectedSeason?.episodes.filter(ep => 
    ep.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ep.overview.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-4 gap-4">
        <h2 className="text-2xl font-bold font-headline flex items-center shrink-0">
            <span className="w-1 h-7 bg-primary mr-3"></span>
            Episodes
        </h2>
        <div className='flex items-center gap-2 w-full'>
          <SeasonSelector seasons={seasons} onSeasonChange={handleSeasonChange} />
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search episode..." 
              className="pl-10"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>
      <ScrollArea className="h-[480px] pr-4">
        {selectedSeason && (
            <div className="space-y-3">
                {filteredEpisodes?.map((episode) => (
                    <EpisodeCard key={episode.id} episode={episode} onPlay={() => onEpisodePlay(selectedSeason.season_number, episode.episode_number)} />
                ))}
            </div>
        )}
      </ScrollArea>
    </div>
  );
}
