
import { Suspense } from 'react';
import { searchMovies } from '@/lib/data';
import { MovieCard } from '@/components/movie-card';
import { Skeleton } from '@/components/ui/skeleton';
import { SearchClientPage } from '@/components/search-client-page';
import type { Metadata } from 'next';

interface SearchPageProps {
  searchParams: {
    q?: string;
  };
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
    const query = searchParams.q || '';
    
    const title = query ? `Search results for "${query}"` : 'Search';
    const description = query ? `Find movies and TV shows matching "${query}".` : 'Search for movies and TV shows.';

    const canonicalUrl = `/search${query ? `?q=${encodeURIComponent(query)}` : ''}`;

    return {
        title: `${title} - kisskh`,
        description: description,
        alternates: {
            canonical: canonicalUrl,
        }
    };
}

function SearchResultsSkeleton() {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 18 }).map((_, i) => (
                <div key={i}>
                    <Skeleton className="aspect-[2/3] w-full" />
                    <Skeleton className="h-4 w-3/4 mt-2" />
                </div>
            ))}
        </div>
    )
}

async function SearchPageContent({ query }: { query: string }) {
  const initialItems = await searchMovies(query, 1);

  if (initialItems.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold">No results found for &quot;{query}&quot;</h2>
        <p className="text-muted-foreground mt-2">Try searching for something else.</p>
      </div>
    );
  }

  return <SearchClientPage initialItems={initialItems} query={query} />;
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || '';

  return (
    <div className="container py-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">
        Search Results {query && <span className="text-muted-foreground">for &quot;{query}&quot;</span>}
      </h1>
      <Suspense fallback={<SearchResultsSkeleton />}>
        {query ? <SearchPageContent query={query} /> : <p className='text-muted-foreground'>Please enter a search term to see results.</p>}
      </Suspense>
    </div>
  );
}
