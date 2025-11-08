
import { getItems } from '@/lib/data';
import { MovieCarousel } from '@/components/movie-carousel';
import { HeroSection } from '@/components/hero-section';

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
        <MovieCarousel title="Trending TV Shows" movies={trending} />
        <MovieCarousel title="K-Drama" movies={kDramas} key="k-dramas" />
        <MovieCarousel title="C-Drama" movies={cDramas} />
        <MovieCarousel title="Anime" movies={anime} />
        <MovieCarousel title="On The Air" movies={onTheAir} />
        <MovieCarousel title="Top Rated" movies={topRated} />
      </div>
    </div>
  );
}
