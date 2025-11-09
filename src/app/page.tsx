
import { getItems } from '@/lib/data';
import { HeroSection } from '@/components/hero-section';
import { MovieCarousel } from '@/components/movie-carousel';

export default async function Home() {
  const featured = await getItems('trending_today', 1, true);
  const trending = await getItems('trending_today');
  const kDramas = await getItems('k_drama_on_air');
  const cDramas = await getItems('c_drama');
  const anime = await getItems('anime');
  const popularMovies = await getItems('popular_movies');
  const topRated = await getItems('top_rated_movies');

  return (
    <div className="flex flex-col">
      {featured && featured.length > 0 && <HeroSection movies={featured} />}
      <div className="container py-8 space-y-12">
        <MovieCarousel title="Trending Today" movies={trending} seeAllHref="/discover/trending_today" />
        <MovieCarousel title="Popular K-Dramas" movies={kDramas} seeAllHref="/discover/k_drama" />
        <MovieCarousel title="Popular C-Dramas" movies={cDramas} seeAllHref="/discover/c_drama" />
        <MovieCarousel title="Anime" movies={anime} seeAllHref="/discover/anime" />
        <MovieCarousel title="Popular Movies" movies={popularMovies} seeAllHref="/discover/popular_movies" />
        <MovieCarousel title="Top Rated" movies={topRated} seeAllHref="/discover/top_rated_movies" />
      </div>
    </div>
  );
}
