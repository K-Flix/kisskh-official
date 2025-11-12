
import Image from 'next/image';
import type { Episode } from '@/lib/types';
import { Download, PlayCircle, CalendarClock } from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface EpisodeCardProps {
  episode: Episode;
  showId: number;
  seasonNumber: number;
  showBackdropPath: string;
  onPlay: () => void;
  isPlaying: boolean;
}

export function EpisodeCard({ episode, showId, seasonNumber, showBackdropPath, onPlay, isPlaying }: EpisodeCardProps) {
  const downloadUrl = `https://dl.vidsrc.vip/tv/${showId}/${seasonNumber}/${episode.episode_number}`;
  const isReleased = episode.air_date ? new Date(episode.air_date) <= new Date() : false;

  const imagePath = isReleased && episode.still_path ? episode.still_path : showBackdropPath;
  
  return (
    <div 
        onClick={isReleased ? onPlay : undefined}
        className={cn(
            'flex items-center gap-4 p-3 group transition-all duration-200 rounded-lg bg-secondary/80',
            isReleased ? 'cursor-pointer hover:bg-white/10' : 'cursor-default opacity-70',
            isPlaying ? 'border-2 border-primary' : 'border-2 border-transparent'
        )}
    >
      <div className="relative w-32 sm:w-40 flex-shrink-0 aspect-video rounded-md overflow-hidden bg-muted">
        <Image 
            src={imagePath || '/placeholder.svg'} 
            alt={episode.name} 
            fill
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className={`absolute inset-0 bg-black/20 flex items-center justify-center transition-opacity ${isReleased ? 'opacity-0 group-hover:opacity-100' : 'opacity-100 bg-black/50'}`}>
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
        <span className="absolute bottom-1 left-2 bg-black/70 text-white text-xs font-bold px-1.5 py-0.5 rounded pointer-events-none">{episode.episode_number}</span>
      </div>
      <div className="flex-1 min-w-0">
        <h3 className={cn('text-base font-bold truncate', isPlaying ? 'text-primary' : 'text-white')}>{`Chapter ${episode.episode_number}: ${episode.name}`}</h3>
        <p className="text-sm text-muted-foreground mt-1.5 line-clamp-3">
            {isReleased 
                ? episode.overview || 'No description available for this episode.'
                : <span className="flex items-center gap-2"><CalendarClock className="w-4 h-4"/>Airs on {format(new Date(episode.air_date!), 'MMMM do, yyyy')}</span>
            }
        </p>
      </div>
      <Button
          asChild
          variant="ghost"
          size="icon"
          className="ml-auto flex-shrink-0 w-11 h-11 rounded-full bg-background/50 hover:bg-background/80 disabled:opacity-50 disabled:pointer-events-none self-center hidden md:flex"
          aria-label={`Download episode ${episode.episode_number}`}
          title={`Download episode ${episode.episode_number}`}
          onClick={(e) => e.stopPropagation()} // Prevents playing the episode
          disabled={!isReleased}
      >
          <Link href={isReleased ? downloadUrl : '#'} target="_blank" rel="noopener noreferrer" className={!isReleased ? 'pointer-events-none' : ''}>
            <Download className="w-5 h-5 text-gray-300"/>
          </Link>
      </Button>
    </div>
  )
}
