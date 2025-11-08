
import { getTrending, getKDramas, getCDramas, getAnime } from '@/lib/data';
import { MovieCarousel } from '@/components/movie-carousel';
import { Separator } from '@/components/ui/separator';

export default async function DiscoverPage() {
  const trending = await getTrending('day');
  const kDramas = await getKDramas();
  const cDramas = await getCDramas();
  const anime = await getAnime();

  return (
    <div className="container py-8 space-y-8">
        <div>
            <h1 className="text-3xl font-bold mb-2">Discover</h1>
            <p className="text-muted-foreground">Discover the best movies and TV shows to watch, from trending series to popular K-Dramas, C-Dramas and Anime.</p>
        </div>
        <Separator />
      <MovieCarousel title="Trending" movies={trending} />
      <MovieCarousel title="K-Drama" movies={kDramas} key="k-dramas" />
      <MovieCarousel title="C-Drama" movies={cDramas} />
      <MovieCarousel title="Anime" movies={anime} />
    </div>
  );
}
