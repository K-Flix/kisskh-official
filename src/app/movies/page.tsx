
import { getFeatured, getItems } from '@/lib/data';
import { MovieCarousel } from '@/components/movie-carousel';
import { Separator } from '@/components/ui/separator';
import { HeroSection } from '@/components/hero-section';

export default async function MoviesPage() {
  const featured = await getItems('trending_movies', 1);
  const popularMovies = await getItems('popular_movies');
  const topRated = await getItems('top_rated_movies');
  const nowPlaying = await getItems('now_playing_movies');
  const upcoming = await getItems('upcoming_movies');

  return (
    <div className="flex flex-col">
      {featured && featured.length > 0 && <HeroSection movies={featured} />}
      <div className="container py-8 space-y-8">
          <div>
              <h1 className="text-3xl font-bold mb-2">Movies</h1>
              <p className="text-muted-foreground">Browse through our collection of popular and top-rated movies.</p>
          </div>
          <Separator />
        <MovieCarousel title="Popular Movies" movies={popularMovies} />
        <MovieCarousel title="Top Rated Movies" movies={topRated} />
        <MovieCarousel title="Now Playing" movies={nowPlaying} />
        <MovieCarousel title="Upcoming" movies={upcoming} />
      </div>
    </div>
  );
}
