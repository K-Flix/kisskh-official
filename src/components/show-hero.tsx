'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { ShowDetails } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Star, Calendar, Play, Video, Download, ArrowLeft, X } from 'lucide-react';
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
      
      {show.logo_path ? (
        <div className="relative w-full max-w-sm h-20 md:h-28">
          <Image
            src={show.logo_path}
            alt={`${show.title} logo`}
            fill
            className="object-contain object-left-bottom"
            data-ai-hint="tv show logo"
          />
        </div>
      ) : (
        <h1 className="text-4xl md:text-6xl font-bold font-headline text-white drop-shadow-lg">
          {show.title}
        </h1>
      )}

      <div className="flex items-center gap-4 text-sm text-foreground/80">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span>{show.vote_average.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{showYear}</span>
          </div>
          <Badge variant="outline" className='border-white text-white'>TV Show</Badge>
      </div>
      <div className="flex flex-wrap gap-2">
        {show.genres.map((genre) => (
          <Badge key={genre.id} variant="secondary" className="backdrop-blur-sm bg-white/10">{genre.name}</Badge>
        ))}
      </div>

      <p className="max-w-2xl text-foreground/80 md:text-base drop-shadow-md line-clamp-3">
        {show.overview}
      </p>
      <div className="flex flex-wrap gap-2 md:gap-4 items-center">
        <Button onClick={onPlayClick} size="lg" className="bg-white text-black hover:bg-white/90">
            <Play className="mr-2" />
            Play
        </Button>
        <WatchlistButton movie={show} />
        <Button variant="outline" className="bg-transparent border-white/50 hover:bg-white/10">
            <Video className="mr-2" />
            Trailer
        </Button>
        <Button variant="ghost" size="icon">
            <Download />
            <span className="sr-only">Download</span>
        </Button>
      </div>
    </div>
  );
}
