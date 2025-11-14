'use client';

import Image from 'next/image';
import type { Episode } from '@/lib/types';
import { PlayCircle, CalendarClock, Download } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import Link from 'next/link';

interface EpisodeCardProps {
  episode: Episode;
  showId: number;
  seasonNumber: number;
  onPlay: () => void;
  isPlaying: boolean;
}

export function EpisodeCard({ episode, showId, seasonNumber, onPlay, isPlaying }: EpisodeCardProps) {
  const isReleased = episode.air_date ? new Date(episode.air_date) <= new Date() : false;
  const downloadUrl = `https://dl.vidsrc.vip/tv/${showId}/${seasonNumber}/${episode.episode_number}`;

  return (
    <div
      className={cn(
        'p-3 group transition-all duration-200 rounded-lg bg-secondary/80 flex flex-col sm:flex-row sm:items-center gap-4',
        isPlaying ? 'ring-2 ring-primary' : 'ring-2 ring-transparent'
      )}
    >
      <div
        onClick={isReleased ? onPlay : undefined}
        className={cn(
            'flex items-center gap-4 flex-grow',
            isReleased ? 'cursor-pointer' : 'cursor-default opacity-70'
        )}
      >
        <div className="relative w-32 sm:w-40 flex-shrink-0 aspect-video rounded-md overflow-hidden bg-muted">
          <Image
            src={episode.still_path || '/placeholder.svg'}
            alt={episode.name}
            fill
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className={cn(
            'absolute inset-0 bg-black/20 flex items-center justify-center transition-opacity',
            isReleased ? 'opacity-0 group-hover:opacity-100' : 'opacity-100 bg-black/50'
          )}>
            {isReleased ? (
              <PlayCircle className="w-10 h-10 text-white" />
            ) : (
              <div className="text-center text-white font-semibold">
                <p className="text-sm">Coming Soon</p>
                {episode.air_date && (
                  <p className="text-xs">{format(new Date(episode.air_date), 'MMM d, yyyy')}</p>
                )}
              </div>
            )}
          </div>
          <span className="absolute bottom-1 left-1 bg-black/70 text-white text-xs font-bold px-1.5 py-0.5 rounded-full w-6 h-6 flex items-center justify-center rounded-full">{episode.episode_number}</span>
        </div>

        <div className="flex-grow min-w-0">
          <h3 className={cn('text-base font-bold truncate', isPlaying ? 'text-primary' : 'text-white')}>{episode.name}</h3>
          <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2">
            {isReleased
              ? episode.overview || 'No description available for this episode.'
              : <span className="flex items-center gap-2"><CalendarClock className="w-4 h-4" />Airs on {format(new Date(episode.air_date!), 'MMMM do, yyyy')}</span>
            }
          </p>
        </div>
      </div>
      
      {isReleased && (
        <Button asChild variant="secondary" size="sm" className="w-full sm:w-auto flex-shrink-0">
          <Link href={downloadUrl} target="_blank" onClick={(e) => e.stopPropagation()}>
            <Download className="w-4 h-4 mr-2" />
            Download
          </Link>
        </Button>
      )}
    </div>
  );
}