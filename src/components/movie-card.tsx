import Image from 'next/image';
import Link from 'next/link';
import type { Movie, Show } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { WatchlistButton } from '@/components/watchlist-button';

interface MovieCardProps {
  movie: Movie | Show;
}

export function MovieCard({ movie }: MovieCardProps) {
  const href = movie.media_type === 'tv' ? `/tv/${movie.id}` : `/movie/${movie.id}`;
  
  return (
    <Link href={href} className="group block">
      <Card className="overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/30">
        <CardContent className="p-0 relative">
          <div className="aspect-[2/3] w-full relative">
            <Image
              src={movie.poster_path}
              alt={movie.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              data-ai-hint="movie poster"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-end p-2">
                 <WatchlistButton movie={movie} />
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="mt-2">
        <h3 className="font-semibold text-sm truncate group-hover:text-primary">{movie.title}</h3>
      </div>
    </Link>
  );
}