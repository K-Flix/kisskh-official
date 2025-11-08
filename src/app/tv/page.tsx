
import { getTrending, getKDramas, getCDramas } from '@/lib/data';
import { MovieCarousel } from '@/components/movie-carousel';
import { Separator } from '@/components/ui/separator';

export default async function TVPage() {
  const trending = await getTrending('day', 'tv');
  const kDramas = await getKDramas();
  const cDramas = await getCDramas();

  return (
    <div className="container py-8 space-y-8">
        <div>
            <h1 className="text-3xl font-bold mb-2">TV Shows</h1>
            <p className="text-muted-foreground">Discover the best TV shows to watch, from trending series to popular K-Dramas and C-Dramas.</p>
        </div>
        <Separator />
      <MovieCarousel title="Trending TV Shows" movies={trending} />
      <MovieCarousel title="K-Drama" movies={kDramas} key="k-dramas" />
      <MovieCarousel title="C-Drama" movies={cDramas} />
    </div>
  );
}
