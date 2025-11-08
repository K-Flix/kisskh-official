
import { Suspense } from 'react';
import { searchMovies } from '@/lib/data';
import { MovieCard } from '@/components/movie-card';
import { Skeleton } from '@/components/ui/skeleton';

interface SearchPageProps {
  searchParams: {
    q?: string;
  };
}

function SearchResultsSkeleton() {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
                <div key={i}>
                    <Skeleton className="aspect-[2/3] w-full" />
                    <Skeleton className="h-4 w-3/4 mt-2" />
                </div>
            ))}
        </div>
    )
}

async function SearchResults({ query }: { query: string }) {
  const movies = await searchMovies(query);

  return (
    <>
      {movies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <h2 className="text-2xl font-semibold">No results found for &quot;{query}&quot;</h2>
          <p className="text-muted-foreground mt-2">Try searching for something else.</p>
        </div>
      )}
    </>
  );
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || '';

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">
        Search Results {query && <span className="text-muted-foreground">for &quot;{query}&quot;</span>}
      </h1>
      <Suspense fallback={<SearchResultsSkeleton />}>
        {query ? <SearchResults query={query} /> : <p className='text-muted-foreground'>Please enter a search term to see results.</p>}
      </Suspense>
    </div>
  );
}

    