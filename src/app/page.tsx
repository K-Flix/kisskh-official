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
        <MovieCarousel title="Trending Today" movies={trending} />
        <div className="my-8">
            <Link href="#">
                <Image src="https://picsum.photos/seed/ad/1200/150" width={1200} height={150} alt="Ad banner" className="w-full h-auto rounded-lg" />
            </Link>
        </div>
        <MovieCarousel title="Popular K-Dramas" movies={kDramas} />
        <MovieCarousel title="Popular C-Dramas" movies={cDramas} />
        <MovieCarousel title="Anime" movies={anime} />
        <MovieCarousel title="Popular Movies" movies={popularMovies} />
        <MovieCarousel title="Top Rated" movies={topRated} />
      </div>
    </div>
  );
}

    