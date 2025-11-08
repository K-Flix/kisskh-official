import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getMovieById } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { Star, User } from 'lucide-react';
import { SimilarShows } from '@/components/similar-shows';
import { WatchlistButton } from '@/components/watchlist-button';

interface MoviePageProps {
  params: {
    id: string;
  };
}

export default async function MoviePage({ params }: MoviePageProps) {
  const movieId = parseInt(params.id, 10);
  if (isNaN(movieId)) {
    notFound();
  }

  const movie = await getMovieById(movieId);

  if (!movie) {
    notFound();
  }

  return (
    <div className="container py-8">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="aspect-[2/3] relative rounded-lg overflow-hidden shadow-lg shadow-primary/20">
            <Image
              src={movie.poster_path}
              alt={movie.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
              priority
              data-ai-hint="movie poster"
            />
          </div>
        </div>
        <div className="md:col-span-2 space-y-6">
          <div className="space-y-3">
            <h1 className="text-4xl font-bold font-headline">{movie.title}</h1>
            <div className="flex items-center gap-4 text-muted-foreground">
              <span>{movie.release_date.split('-')[0]}</span>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span>{movie.vote_average.toFixed(1)}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {movie.genres.map((genre) => (
                <Badge key={genre.id} variant="secondary">{genre.name}</Badge>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
              <WatchlistButton movie={movie} />
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Overview</h2>
            <p className="text-muted-foreground">{movie.overview}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Cast</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {movie.cast.slice(0, 4).map((member) => (
                <div key={member.name} className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                    {member.profile_path ? (
                      <Image
                        src={member.profile_path}
                        alt={member.name}
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.character}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-12">
        <SimilarShows movie={movie} />
      </div>
    </div>
  );
}
