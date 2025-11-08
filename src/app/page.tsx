
import { getFeaturedMovie, getTrending, getKDramas, getCDramas, getAnime, getPopularMovies, getTopRated } from '@/lib/data';
import { HeroSection } from '@/components/hero-section';
import { MovieCarousel } from '@/components/movie-carousel';
import Image from 'next/image';
import Link from 'next/link';

export default async function Home() {
  const featuredMovie = await getFeaturedMovie();
  const trending = await getTrending('day');
  const kDramas = await getKDramas();
  const cDramas = await getCDramas();
  const anime = await getAnime();
  const popularMovies = await getPopularMovies();
  const topRated = await getTopRated();

  return (
    <div className="flex flex-col">
      {featuredMovie && <HeroSection movie={featuredMovie} />}
      <div className="container py-8 space-y-12">
        <MovieCarousel title="Trending Today" movies={trending} seeAllHref="/tv" />
        <MovieCarousel title="Popular K-Dramas" movies={kDramas} seeAllHref="/tv?genre=k-drama" />
        <MovieCarousel title="Popular C-Dramas" movies={cDramas} seeAllHref="/tv?genre=c-drama" />
        <MovieCarousel title="Anime" movies={anime} seeAllHref="/discover?genre=anime" />
        <MovieCarousel title="Popular Movies" movies={popularMovies} seeAllHref="/movies" />
        <MovieCarousel title="Top Rated" movies={topRated} seeAllHref="/movies?sort=top-rated" />
      </div>
    </div>
  );
}
