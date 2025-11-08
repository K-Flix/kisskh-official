import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getMovieById } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, Calendar, Play, Plus, Video, Download, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WatchlistButton } from '@/components/watchlist-button';
import { ActorCard } from '@/components/actor-card';
import { MovieCarousel } from '@/components/movie-carousel';

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

  const movieYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
  const runtimeHours = movie.runtime ? Math.floor(movie.runtime / 60) : 0;
  const runtimeMinutes = movie.runtime ? movie.runtime % 60 : 0;

  return (
    <div className="flex flex-col">
       <div className="relative h-[60vh] md:h-[80vh] w-full">
        <Link href="/" className="absolute top-4 left-4 z-20 bg-background/50 p-2 rounded-full hover:bg-background/80 transition-colors">
            <ArrowLeft className="w-6 h-6"/>
            <span className="sr-only">Back</span>
        </Link>
        <Image
            src={movie.backdrop_path}
            alt={`Backdrop for ${movie.title}`}
            fill
            priority
            className="object-cover object-top"
            data-ai-hint="movie backdrop"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/30 to-transparent" />
        <div className="relative z-10 flex flex-col justify-end h-full container pb-8 md:pb-16 space-y-4">
          
          {movie.logo_path ? (
            <div className="relative w-full max-w-sm h-20 md:h-28">
              <Image
                src={movie.logo_path}
                alt={`${movie.title} logo`}
                fill
                className="object-contain object-left-bottom"
                data-ai-hint="movie logo"
              />
            </div>
          ) : (
            <h1 className="text-4xl md:text-6xl font-bold font-headline text-white drop-shadow-lg">
              {movie.title}
            </h1>
          )}

          <div className="flex items-center gap-4 text-sm text-foreground/80">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span>{movie.vote_average.toFixed(1)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{movieYear}</span>
              </div>
              {movie.runtime > 0 && (
                <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{runtimeHours}h {runtimeMinutes}m</span>
                </div>
              )}
          </div>
          <div className="flex flex-wrap gap-2">
            {movie.genres.map((genre) => (
              <Badge key={genre.id} variant="secondary" className="backdrop-blur-sm bg-white/10">{genre.name}</Badge>
            ))}
          </div>

          <p className="max-w-2xl text-foreground/80 md:text-base drop-shadow-md line-clamp-3">
            {movie.overview}
          </p>
          <div className="flex flex-wrap gap-2 md:gap-4 items-center">
            <Button asChild size="lg" className="bg-white text-black hover:bg-white/90">
                <Link href="#">
                    <Play className="mr-2" />
                    Play
                </Link>
            </Button>
            <WatchlistButton movie={movie} />
            <Button variant="outline" className="bg-transparent border-white/50 hover:bg-white/10">
                <Video className="mr-2" />
                Trailer
            </Button>
            <Button variant="ghost" size="icon">
                <Download />
                <span className="sr-only">Download</span>
            </Button>
            <Button variant="ghost">Similar</Button>
          </div>
        </div>
      </div>
      <div className="container py-8 md:py-12 space-y-12">
        <div>
            <h2 className="text-2xl font-bold mb-4 font-headline flex items-center">
                <span className="w-1 h-7 bg-primary mr-3"></span>
                Actors
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4 sm:gap-6">
                {movie.cast.slice(0, 8).map((member) => (
                    <ActorCard key={member.name} actor={member} />
                ))}
            </div>
        </div>
        
        {movie.similar && movie.similar.length > 0 && (
            <MovieCarousel title="You may like" movies={movie.similar} />
        )}
      </div>
    </div>
  );
}
