import { getFeaturedMovie, getGenres, getMoviesByGenre, getTrendingMovies } from '@/lib/data';
import { HeroSection } from '@/components/hero-section';
import { MovieCarousel } from '@/components/movie-carousel';

export default async function Home() {
  const featuredMovie = await getFeaturedMovie();
  const trendingMovies = await getTrendingMovies();
  const genres = await getGenres();

  const moviesByGenre = await Promise.all(
    genres.slice(0, 5).map(async (genre) => {
      const movies = await getMoviesByGenre(genre.id);
      return { genre, movies };
    })
  );

  return (
    <div className="flex flex-col">
      {featuredMovie && <HeroSection movie={featuredMovie} />}
      <div className="container py-8 space-y-12">
        <MovieCarousel title="Trending Now" movies={trendingMovies} />
        {moviesByGenre.map(({ genre, movies }) => (
          <MovieCarousel key={genre.id} title={genre.name} movies={movies} />
        ))}
      </div>
    </div>
  );
}
