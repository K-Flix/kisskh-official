
import Image from 'next/image';
import Link from 'next/link';
import type { Movie, Show } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';

interface MovieCardProps {
  movie: Movie | Show;
  priority?: boolean;
}

export function MovieCard({ movie, priority = false }: MovieCardProps) {
  const href = movie.media_type === 'tv' ? `/tv/${movie.id}` : `/movie/${movie.id}`;
  const year = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';
  
  return (
    <Link href={href} className="group block">
      <Card className="overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/30 border-0">
        <CardContent className="p-0 relative">
          <div className="aspect-[2/3] w-full relative">
            <Image
              src={movie.poster_path}
              alt={movie.title}
              fill
              priority={priority}
              className="object-cover rounded-md"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              data-ai-hint="movie poster"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                 <h3 className="font-bold text-base text-white truncate">{movie.title}</h3>
                 <div className="text-xs text-muted-foreground font-medium mt-1">
                    <span>{year}</span>
                    <span className="mx-1.5">&bull;</span>
                    <span>{movie.media_type === 'tv' ? 'TV' : 'Movie'}</span>
                 </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
