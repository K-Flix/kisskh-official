
import { getItems } from '@/lib/data';
import { MovieCarousel } from '@/components/movie-carousel';
import { HeroSection } from '@/components/hero-section';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'TV Shows - kisskh',
    description: 'Browse trending, K-Dramas, C-Dramas, anime, and top-rated TV shows.',
};

export default async function TVPage() {
  const featured = await getItems('trending_tv', 1, true);
  const trending = await getItems('trending_tv');
  const kDramas = await getItems('k_drama');
  const cDramas = await getItems('c_drama');
  const anime = await getItems('anime');
  const onTheAir = await getItems('on_the_air_tv');
  const topRated = await getItems('top_rated_tv');

  return (
    <div className="flex flex-col">
      {featured && featured.length > 0 && <HeroSection movies={featured} />}
      <div className="container py-8 space-y-8">
        <MovieCarousel title="Trending TV Shows" movies={trending} seeAllHref="/category/trending_tv" />
        <MovieCarousel title="K-Drama" movies={kDramas} seeAllHref="/category/k_drama" />
        <MovieCarousel title="C-Drama" movies={cDramas} seeAllHref="/category/c_drama" />
        <MovieCarousel title="Anime" movies={anime} seeAllHref="/category/anime" />
        <MovieCarousel title="On The Air" movies={onTheAir} seeAllHref="/category/on_the_air_tv" />
        <MovieCarousel title="Top Rated" movies={topRated} seeAllHref="/category/top_rated_tv" />
      </div>
    </div>
  );
}
