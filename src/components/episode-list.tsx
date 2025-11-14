
'use client';

import { useState } from 'react';
import type { Season } from '@/lib/types';
import { SeasonSelector } from '@/components/season-selector';
import { EpisodeCard } from '@/components/episode-card';
import { Input } from './ui/input';
import { Search } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';

interface EpisodeListProps {
  showId: number;
  seasons: Season[];
  showBackdropPath: string;
  onEpisodePlay: (season: number, episode: number) => void;
  currentEpisode?: { season: number; episode: number };
}

export function EpisodeList({ showId, seasons, showBackdropPath, onEpisodePlay, currentEpisode }: EpisodeListProps) {
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
    (ep.overview && ep.overview.toLowerCase().includes(searchQuery.toLowerCase()))
  ) || [];

  return (
    <section>
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-1.5 h-7 bg-primary rounded-full" />
        <h2 className="text-2xl font-bold">Episodes</h2>
      </div>

      <div className="space-y-4">
        <div className="bg-secondary/30 border border-border/50 rounded-lg p-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="w-full md:w-1/3">
                <SeasonSelector seasons={seasons} selectedSeason={selectedSeason?.season_number} onSeasonChange={handleSeasonChange} />
            </div>
            <div className="relative w-full md:w-2/3 flex items-center">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <Input
                type="text"
                placeholder="Search episodes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-background border-0 rounded-md focus:ring-2 focus:ring-primary text-white py-2.5 pl-10 pr-4"
              />
            </div>
          </div>
        </div>

        <div className="bg-secondary/30 border border-border/50 rounded-lg overflow-hidden">
          <ScrollArea className="h-[50vh] md:h-[70vh]">
            <div className="p-3 space-y-2">
              {selectedSeason && (
                <>
                  {filteredEpisodes.map((episode) => {
                    const isPlaying = currentEpisode?.season === selectedSeason.season_number && currentEpisode?.episode === episode.episode_number;
                    return (
                      <EpisodeCard
                        key={episode.id}
                        showId={showId}
                        seasonNumber={selectedSeason.season_number}
                        episode={episode}
                        onPlay={() => onEpisodePlay(selectedSeason.season_number, episode.episode_number)}
                        isPlaying={isPlaying}
                      />
                    )
                  })}
                </>
              )}
              {filteredEpisodes.length === 0 && (
                <div className="text-center text-muted-foreground py-16">
                  <p className="text-xl">No episodes found</p>
                  <p className="text-sm mt-1">Try adjusting your search query.</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </section>
  );
}
