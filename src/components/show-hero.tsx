
'use client';

import Image from 'next/image';
import type { ShowDetails } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Star, Calendar, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WatchlistButton } from '@/components/watchlist-button';

interface ShowHeroProps {
  show: ShowDetails;
  onPlayClick: () => void;
}

export function ShowHero({ show, onPlayClick }: ShowHeroProps) {
  const showYear = show.release_date ? new Date(show.release_date).getFullYear() : 'N/A';

  return (
    <div className="relative z-10 flex flex-col justify-end h-full container pb-8 md:pb-16 space-y-4">
      
      <h1 className="text-4xl md:text-5xl font-bold font-headline text-white drop-shadow-lg max-w-2xl">
          {show.title}
      </h1>

      <div className="flex items-center gap-4 text-sm text-foreground/80">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span>{show.vote_average.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{showYear}</span>
          </div>
          {show.genres.slice(0, 2).map((genre) => (
            <Badge key={genre.id} variant="outline" className="backdrop-blur-sm bg-transparent border-white/50 text-white">{genre.name}</Badge>
          ))}
      </div>

      <p className="max-w-xl text-foreground/80 md:text-base drop-shadow-md line-clamp-3">
        {show.overview}
      </p>
      <div className="flex flex-wrap gap-2 md:gap-4 items-center">
        <Button onClick={onPlayClick} size="lg" className="bg-white text-black hover:bg-white/90">
            <Play className="mr-2" />
            Play
        </Button>
        <WatchlistButton movie={show} />
      </div>
    </div>
  );
}
