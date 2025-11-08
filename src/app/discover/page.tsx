
import { getItems } from '@/lib/data';
import { MovieCarousel } from '@/components/movie-carousel';
import { Separator } from '@/components/ui/separator';

export default async function DiscoverPage() {
  const trending = await getItems('trending_today');
  const kDramas = await getItems('k_drama');
  const cDramas = await getItems('c_drama');
  const anime = await getItems('anime');

  return (
    <div className="container py-8 space-y-8">
        <div>
            <h1 className="text-3xl font-bold mb-2">Discover</h1>
            <p className="text-muted-foreground">Discover the best movies and TV shows to watch, from trending series to popular K-Dramas, C-Dramas and Anime.</p>
        </div>
        <Separator />
      <MovieCarousel title="Trending" movies={trending} />
      <MovieCarousel title="K-Drama" movies={kDramas} />
      <MovieCarousel title="C-Drama" movies={cDramas} />
      <MovieCarousel title="Anime" movies={anime} />
    </div>
  );
}

    