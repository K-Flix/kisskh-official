'use client';

import { getTrending, getKDramas, getCDramas } from '@/lib/data';
import { MovieCarousel } from '@/components/movie-carousel';
import { use } from 'react';
import { Separator } from '@/components/ui/separator';

export default function TVPage() {
  const trending = use(getTrending('tv'));
  const kDramas = use(getKDramas());
  const cDramas = use(getCDramas());

  return (
    <div className="container py-8 space-y-8">
        <div>
            <h1 className="text-3xl font-bold mb-2">TV Shows</h1>
            <p className="text-muted-foreground">Discover the best TV shows to watch, from trending series to popular K-Dramas and C-Dramas.</p>
        </div>
        <Separator />
      <MovieCarousel title="Trending TV Shows" movies={trending} />
      <MovieCarousel title="K-Drama" movies={kDramas} />
      <MovieCarousel title="C-Drama" movies={cDramas} />
    </div>
  );
}
