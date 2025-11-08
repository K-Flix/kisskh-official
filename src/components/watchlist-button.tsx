
'use client';

import { BookmarkPlus, BookmarkCheck, Plus } from 'lucide-react';
import { useWatchlist } from '@/context/watchlist-context';
import type { Movie, Show } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface WatchlistButtonProps {
  movie: Movie | Show;
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
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <Button
            variant="secondary"
            size="icon"
            onClick={handleClick}
            className="rounded-full w-11 h-11 bg-gray-500/50 text-white hover:bg-gray-500/40 border border-white/20"
            aria-label={isBookmarked ? 'Remove from watchlist' : 'Add to watchlist'}
          >
            {isBookmarked ? <BookmarkCheck className="h-5 w-5" /> : <Plus className="h-6 w-6" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isBookmarked ? 'Remove from watchlist' : 'Add to watchlist'}</p>
        </TooltipContent>
      </Tooltip>
  );
}
