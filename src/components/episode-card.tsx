import Image from 'next/image';
import type { Episode } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { PlayCircle } from 'lucide-react';

interface EpisodeCardProps {
  episode: Episode;
}

export function EpisodeCard({ episode }: EpisodeCardProps) {
  return (
    <Card className="overflow-hidden border-0 group">
      <CardContent className="p-0">
        <div className="relative aspect-video">
          <Image
            src={episode.still_path || '/placeholder.svg'}
            alt={episode.name}
            fill
            className="object-cover rounded-t-md transition-transform group-hover:scale-105"
          />
           <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <PlayCircle className="w-12 h-12 text-white" />
          </div>
        </div>
        <div className="p-3 bg-secondary rounded-b-md">
          <h3 className="font-semibold text-sm truncate">{episode.episode_number}. {episode.name}</h3>
          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{episode.overview}</p>
        </div>
      </CardContent>
    </Card>
  );
}
