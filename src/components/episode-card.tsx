
import Image from 'next/image';
import type { Episode } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Download, PlayCircle } from 'lucide-react';
import { Button } from './ui/button';

interface EpisodeCardProps {
  episode: Episode;
  onPlay: () => void;
}

export function EpisodeCard({ episode, onPlay }: EpisodeCardProps) {
  return (
    <Card className="overflow-hidden border-0 bg-secondary group flex items-center gap-4 pr-4">
      <div className="relative aspect-video w-48 shrink-0">
        <Image
          src={episode.still_path || '/placeholder.svg'}
          alt={episode.name}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" onClick={onPlay}>
          <PlayCircle className="w-10 h-10 text-white" />
        </div>
        <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded-md">
            {episode.episode_number}
        </div>
      </div>
      <div className="flex-grow py-2">
        <div className='flex justify-between items-start'>
            <div>
                <h3 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">{episode.name}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{episode.overview}</p>
            </div>
            <span className="text-xs text-muted-foreground ml-4 shrink-0">{episode.runtime}m</span>
        </div>
      </div>
      <Button variant="ghost" size="icon" className="shrink-0">
        <Download className="w-5 h-5" />
        <span className='sr-only'>Download episode</span>
      </Button>
    </Card>
  );
}
