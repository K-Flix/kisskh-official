
import { getFeatured, getItems } from '@/lib/data';
import { HeroSection } from '@/components/hero-section';
import { MovieCarousel } from '@/components/movie-carousel';

export default async function Home() {
  const featured = await getFeatured();
  const trending = await getItems('trending_today');
  const kDramas = await getItems('k_drama');
  const cDramas = await getItems('c_drama');
  const anime = await getItems('anime');
  const popularMovies = await getItems('popular_movies');
  const topRated = await getItems('top_rated_movies');

  return (
    <div className="flex flex-col">
      {featured && <HeroSection movie={featured} />}
      <div className="container py-8 space-y-12">
        <MovieCarousel title="Trending Today" movies={trending} seeAllHref="/discover" />
        <MovieCarousel title="Popular K-Dramas" movies={kDramas} seeAllHref="/tv?genre=k-drama" />
        <MovieCarousel title="Popular C-Dramas" movies={cDramas} seeAllHref="/tv?genre=c-drama" />
        <MovieCarousel title="Anime" movies={anime} seeAllHref="/discover?genre=anime" />
        <MovieCarousel title="Popular Movies" movies={popularMovies} seeAllHref="/movies" />
        <MovieCarousel title="Top Rated" movies={topRated} seeAllHref="/movies?sort=top-rated" />
      </div>
    </div>
  );
}

    