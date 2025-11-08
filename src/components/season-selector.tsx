'use client';

import type { Season } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SeasonSelectorProps {
  seasons: Season[];
  onSeasonChange: (seasonNumber: string) => void;
}

export function SeasonSelector({ seasons, onSeasonChange }: SeasonSelectorProps) {
  if (!seasons || seasons.length === 0) {
    return null;
  }
  return (
    <Select defaultValue={seasons[0].season_number.toString()} onValueChange={onSeasonChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a season" />
      </SelectTrigger>
      <SelectContent>
        {seasons.map((season) => (
          <SelectItem key={season.id} value={season.season_number.toString()}>
            {season.name} ({season.episode_count} episodes)
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
