import { getFeaturedMovie, getTrending, getKDramas, getCDramas } from '@/lib/data';
import { HeroSection } from '@/components/hero-section';
import { MovieCarousel } from '@/components/movie-carousel';

export default async function Home() {
  const featuredMovie = await getFeaturedMovie();
  const trending = await getTrending();
  const kDramas = await getKDramas();
  const cDramas = await getCDramas();

  return (
    <div className="flex flex-col">
      {featuredMovie && <HeroSection movie={featuredMovie} />}
      <div className="container py-8 space-y-12">
        <MovieCarousel title="Trending Now" movies={trending} />
        <MovieCarousel title="K-Drama" movies={kDramas} />
        <MovieCarousel title="C-Drama" movies={cDramas} />
      </div>
    </div>
  );
}
