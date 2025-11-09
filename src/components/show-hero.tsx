
'use client';

import Image from 'next/image';
import type { MovieDetails, ShowDetails } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Star, Calendar, Play, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WatchlistButton } from '@/components/watchlist-button';
import { Tooltip, TooltipTrigger, TooltipContent } from './ui/tooltip';

interface ShowHeroProps {
  show: ShowDetails | MovieDetails;
  onPlayClick: () => void;
  onTrailerClick: () => void;
  onSimilarsClick?: () => void;
  children?: React.ReactNode;
}

export function ShowHero({ show, onPlayClick, onTrailerClick, children }: ShowHeroProps) {
  const showYear = show.release_date ? new Date(show.release_date).getFullYear() : 'N/A';
  const isMovie = show.media_type === 'movie';

  return (
    <div className="relative z-10 flex flex-col space-y-4 max-w-md">
      
      {show.logo_path ? (
          <div className="relative w-full max-w-sm h-24 md:h-32 -ml-2">
            <Image
              src={show.logo_path}
              alt={`${show.title} logo`}
              fill
              className="object-contain object-left-bottom drop-shadow-lg"
              data-ai-hint="movie logo"
            />
          </div>
        ) : (
          <h1 className="text-4xl md:text-5xl font-bold font-headline text-white drop-shadow-lg">
              {show.title}
          </h1>
      )}


      <div className="flex items-center flex-wrap gap-2 md:gap-4 text-sm text-foreground/80">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="font-semibold text-white">{show.vote_average.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-1 font-semibold text-white">
            <Calendar className="w-4 h-4" />
            <span>{showYear}</span>
          </div>
          {isMovie && 'runtime' in show && show.runtime ? (
              <Badge variant="outline" className="backdrop-blur-sm bg-black/20 border-white/50 text-white font-semibold">{show.runtime} min</Badge>
          ) : !isMovie && 'number_of_seasons' in show && show.number_of_seasons ? (
            <Badge variant="outline" className="backdrop-blur-sm bg-black/20 border-white/50 text-white font-semibold">{show.number_of_seasons} {show.number_of_seasons > 1 ? 'seasons' : 'season'}</Badge>
          ) : null}

      </div>
        <div className="flex flex-wrap gap-x-2 gap-y-1">
            {show.genres.slice(0, 3).map((genre, index) => (
                <div key={genre.id} className="flex items-center">
                    <span className="text-white/90 text-sm">{genre.name}</span>
                    {index < show.genres.slice(0, 3).length - 1 && <span className="text-white/50 mx-1.5">&bull;</span>}
                </div>
            ))}
        </div>

      <p className="max-w-xl text-foreground/90 text-sm md:text-base drop-shadow-md line-clamp-3">
        {show.overview}
      </p>
      <div className="flex flex-wrap gap-2 md:gap-4 items-center">
        <Button onClick={onPlayClick} size="lg" className="bg-white text-black hover:bg-white/90">
            <Play className="mr-2 fill-black" />
            Play
        </Button>
        <WatchlistButton movie={show} />
        {children}
        {show.trailer_url && (
             <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                    <Button onClick={onTrailerClick} size="icon" variant="secondary" className="rounded-full w-11 h-11 bg-black/20 text-white hover:bg-black/40 border border-white/20 backdrop-blur-sm">
                        <Video/>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Watch Trailer</p>
                </TooltipContent>
            </Tooltip>
        )}
      </div>
    </div>
  );
}
