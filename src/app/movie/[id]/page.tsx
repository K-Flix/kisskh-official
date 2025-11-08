
import { notFound } from 'next/navigation';
import { getMovieById } from '@/lib/data';
import { MoviePageClient } from '@/components/movie-page-client';

interface MoviePageProps {
  params: {
    id: string;
  };
}

export default async function MoviePage({ params }: MoviePageProps) {
  const movieId = parseInt(params.id, 10);
  if (isNaN(movieId)) {
    notFound();
  }

  const movie = await getMovieById(movieId);

  if (!movie) {
    notFound();
  }

  return (
    <div className="relative">
        <div className="md:px-0">
            <MoviePageClient movie={movie} />
        </div>
    </div>
  );
}
