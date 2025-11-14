
import { notFound } from 'next/navigation';
import { getMovieById } from '@/lib/data';
import { MoviePageClient } from '@/components/movie-page-client';
import type { Metadata } from 'next';
import { JsonLd } from '@/components/JsonLd';
import type { Movie as MovieSchema } from 'schema-dts';

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
      description: 'The movie you are looking for could not be found.',
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
    alternates: {
      canonical: `/movie/${movie.id}`,
    }
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

  const movieJsonLd: MovieSchema = {
    '@type': 'Movie',
    name: movie.title,
    description: movie.overview,
    image: movie.poster_path,
    datePublished: movie.release_date,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: movie.vote_average,
      bestRating: 10,
      ratingCount: movie.popularity, // Using popularity as a proxy
    },
    director: movie.cast?.filter(c => c.character === 'Director').map(d => ({ '@type': 'Person', name: d.name })),
    actor: movie.cast?.slice(0, 10).map(a => ({ '@type': 'Person', name: a.name })),
    genre: movie.genres.map(g => g.name),
  };

  return (
    <>
      <JsonLd data={movieJsonLd} />
      <div className="relative">
          <div className="md:px-0">
              <MoviePageClient movie={movie} />
          </div>
      </div>
    </>
  );
}
