
import { notFound } from 'next/navigation';
import { getMovieById } from '@/lib/data';
import { MoviePageClient } from '@/components/movie-page-client';
import type { Metadata } from 'next';

interface MoviePageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: MoviePageProps): Promise<Metadata> {
  const movieId = parseInt(params.id, 10);
  if (isNaN(movieId)) {
    return {
      title: 'Not Found',
    };
  }
  const movie = await getMovieById(movieId);

  if (!movie) {
    return {
      title: 'Not Found',
    };
  }

  return {
    title: `${movie.title} - kisskh`,
    description: movie.overview,
    openGraph: {
      title: `${movie.title} - kisskh`,
      description: movie.overview,
      images: [
        {
          url: movie.backdrop_path,
          width: 1280,
          height: 720,
          alt: movie.title,
        },
        {
          url: movie.poster_path,
          width: 500,
          height: 750,
          alt: movie.title,
        }
      ],
    },
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
