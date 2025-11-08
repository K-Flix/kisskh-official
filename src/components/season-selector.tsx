
'use client';

import type { Season } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SeasonSelectorProps {
  seasons: Season[];
  selectedSeason?: number;
  onSeasonChange: (seasonNumber: string) => void;
}

export function SeasonSelector({ seasons, selectedSeason, onSeasonChange }: SeasonSelectorProps) {
  if (!seasons || seasons.length === 0) {
    return null;
  }
  
  const defaultValue = selectedSeason?.toString() || seasons.find(s => s.season_number > 0)?.season_number.toString() || seasons[0].season_number.toString();

  return (
    <Select value={defaultValue} onValueChange={onSeasonChange}>
      <SelectTrigger className="w-full bg-background border-0 focus:ring-2 focus:ring-primary">
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
