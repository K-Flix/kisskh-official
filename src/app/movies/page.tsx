
import { getPopularMovies, getTopRated } from '@/lib/data';
import { MovieCarousel } from '@/components/movie-carousel';
import { Separator } from '@/components/ui/separator';

export default async function MoviesPage() {
  const popularMovies = await getPopularMovies();
  const topRated = await getTopRated();

  return (
    <div className="container py-8 space-y-8">
        <div>
            <h1 className="text-3xl font-bold mb-2">Movies</h1>
            <p className="text-muted-foreground">Browse through our collection of popular and top-rated movies.</p>
        </div>
        <Separator />
      <MovieCarousel title="Popular Movies" movies={popularMovies} />
      <MovieCarousel title="Top Rated Movies" movies={topRated} />
    </div>
  );
}
