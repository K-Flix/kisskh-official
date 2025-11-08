
import { notFound } from 'next/navigation';
import { getMovieById } from '@/lib/data';
import { MoviePageClient } from '@/components/movie-page-client';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

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
        <Link href="/" className="absolute top-4 left-4 z-50 flex items-center justify-center bg-background/50 p-2 rounded-full hover:bg-background/80 transition-colors">
            <ArrowLeft className="w-6 h-6 text-white"/>
            <span className="sr-only">Back</span>
        </Link>
        <MoviePageClient movie={movie} />
    </div>
  );
}
