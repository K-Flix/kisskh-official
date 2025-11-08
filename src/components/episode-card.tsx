
import Image from 'next/image';
import type { Episode } from '@/lib/types';
import { Download, PlayCircle, CalendarClock } from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';
import { format } from 'date-fns';

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
        className={`flex items-center gap-4 bg-secondary/50 p-2 rounded-lg group transition-all duration-200 ${isReleased ? 'cursor-pointer hover:bg-secondary/80' : 'cursor-default opacity-70'} ${isPlaying ? 'bg-primary/20 border border-primary/50' : 'border border-transparent'}`}
    >
      <div className="relative w-48 flex-shrink-0 aspect-video rounded-md overflow-hidden bg-muted">
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
        <div className="flex items-baseline justify-between">
            <h3 className={`text-base font-bold truncate ${isPlaying ? 'text-primary' : 'text-white'}`}>{episode.name}</h3>
            {episode.runtime && <span className="text-sm text-muted-foreground flex-shrink-0 ml-4">{episode.runtime}m</span>}
        </div>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
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
          className="ml-auto flex-shrink-0 w-12 h-12 rounded-full bg-background/50 hover:bg-background/80 disabled:opacity-50 disabled:pointer-events-none"
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
