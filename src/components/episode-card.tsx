
import Image from 'next/image';
import type { Episode } from '@/lib/types';
import { Download, PlayCircle } from 'lucide-react';
import { Button } from './ui/button';

interface EpisodeCardProps {
  episode: Episode;
  onPlay: () => void;
  isPlaying: boolean;
}

export function EpisodeCard({ episode, onPlay, isPlaying }: EpisodeCardProps) {
  return (
    <div 
        onClick={onPlay}
        className={`flex items-center gap-4 bg-secondary/50 p-2 rounded-lg group transition-all duration-200 cursor-pointer hover:bg-secondary/80 ${isPlaying ? 'bg-primary/20 border border-primary/50' : 'border border-transparent'}`}
    >
      <div className="relative w-48 flex-shrink-0 aspect-video rounded-md overflow-hidden bg-muted">
        <Image 
            src={episode.still_path || '/placeholder.svg'} 
            alt={episode.name} 
            fill
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <PlayCircle className="w-10 h-10 text-white" />
        </div>
        <span className="absolute bottom-1 left-2 bg-black/70 text-white text-xs font-bold px-1.5 py-0.5 rounded pointer-events-none">{episode.episode_number}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between">
            <h3 className={`text-base font-bold truncate ${isPlaying ? 'text-primary' : 'text-white'}`}>{episode.name}</h3>
            {episode.runtime && <span className="text-sm text-muted-foreground flex-shrink-0 ml-4">{episode.runtime}m</span>}
        </div>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {episode.overview || 'No description available for this episode.'}
        </p>
      </div>
      <Button
          variant="ghost"
          size="icon"
          className="ml-auto flex-shrink-0 w-12 h-12 rounded-full bg-background/50 hover:bg-background/80"
          aria-label={`Download episode ${episode.episode_number}`}
          title={`Download episode ${episode.episode_number}`}
          onClick={(e) => e.stopPropagation()} // Prevents playing the episode
      >
          <Download className="w-5 h-5 text-gray-300"/>
      </Button>
    </div>
  )
}
