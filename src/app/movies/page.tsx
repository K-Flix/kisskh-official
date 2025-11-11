
import { getItems } from '@/lib/data';
import { MovieCarousel } from '@/components/movie-carousel';
import { HeroSection } from '@/components/hero-section';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Movies - kisskh',
  description: 'Browse popular, top-rated, now playing, and upcoming movies.',
};

export default async function MoviesPage() {
  const featured = await getItems('trending_movies', 1, true);
  const popularMovies = await getItems('popular_movies');
  const topRated = await getItems('top_rated_movies');
  const nowPlaying = await getItems('now_playing_movies');
  const upcoming = await getItems('upcoming_movies');

  return (
    <div className="flex flex-col">
      {featured && featured.length > 0 && <HeroSection movies={featured} />}
      <div className="container py-8 space-y-8">
        <MovieCarousel title="Popular Movies" movies={popularMovies} seeAllHref="/category/popular_movies" />
        <MovieCarousel title="Top Rated Movies" movies={topRated} seeAllHref="/category/top_rated_movies" />
        <MovieCarousel title="Now Playing" movies={nowPlaying} seeAllHref="/category/now_playing_movies" />
        <MovieCarousel title="Upcoming" movies={upcoming} seeAllHref="/category/upcoming_movies" />
      </div>
    </div>
  );
}
