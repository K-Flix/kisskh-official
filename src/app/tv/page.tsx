
import { getItems } from '@/lib/data';
import { MovieCarousel } from '@/components/movie-carousel';
import { Separator } from '@/components/ui/separator';
import { HeroSection } from '@/components/hero-section';

export default async function TVPage() {
  const featured = await getItems('trending_tv', 1);
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
          <div>
              <h1 className="text-3xl font-bold mb-2">TV Shows</h1>
              <p className="text-muted-foreground">Discover the best TV shows to watch, from trending series to popular K-Dramas and C-Dramas.</p>
          </div>
          <Separator />
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
