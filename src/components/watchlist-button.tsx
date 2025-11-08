'use client';

import { BookmarkPlus, BookmarkCheck } from 'lucide-react';
import { useWatchlist } from '@/context/watchlist-context';
import type { Movie } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface WatchlistButtonProps {
  movie: Movie;
}

export function WatchlistButton({ movie }: WatchlistButtonProps) {
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const isBookmarked = isInWatchlist(movie.id);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (isBookmarked) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movie);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={handleClick}
            className="border-2 border-white/50 bg-black/30 text-white hover:bg-accent hover:text-accent-foreground backdrop-blur-sm"
            aria-label={isBookmarked ? 'Remove from watchlist' : 'Add to watchlist'}
          >
            {isBookmarked ? <BookmarkCheck /> : <BookmarkPlus />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isBookmarked ? 'Remove from watchlist' : 'Add to watchlist'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
