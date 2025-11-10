
import { getItems, getGenres, getCountries } from '@/lib/data';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { networksConfig } from '@/lib/networks';
import { DiscoverClientPage } from '@/components/discover-client-page';
import type { Metadata } from 'next';

interface DiscoverPageProps {
    searchParams: {
        category?: string;
        title?: string;
        [key: string]: string | string[] | undefined;
    };
}

export async function generateMetadata({ searchParams }: DiscoverPageProps): Promise<Metadata> {
    const title = searchParams.title || 'Discover';
    return {
        title: `${title} - kisskh`,
        description: `Discover new movies and TV shows. Filter by genre, country, year, and more.`,
    };
}

function DiscoverSkeleton() {
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

export default async function DiscoverPage({ searchParams }: DiscoverPageProps) {
    const { category, title, ...filters } = searchParams;
    
    // Convert string array to string
    const flatFilters: Record<string, string> = {};
    for (const key in filters) {
        const value = filters[key];
        if (Array.isArray(value)) {
            flatFilters[key] = value[0];
        } else if (value) {
            flatFilters[key] = value;
        }
    }

    const hasFilters = Object.keys(flatFilters).length > 0;
    const categoryKey = category || (hasFilters ? 'discover_all' : 'trending_today');
    const initialItems = await getItems(categoryKey, 1, false, true, flatFilters);
    const genres = await getGenres();
    const countries = await getCountries();

    const years = Array.from({ length: new Date().getFullYear() - 1900 + 1 }, (_, i) => (new Date().getFullYear() - i).toString());

    return (
        <div className="container py-8 space-y-8">
            <Suspense fallback={<DiscoverSkeleton />}>
                <DiscoverClientPage
                    initialItems={initialItems}
                    initialFilters={flatFilters}
                    genres={genres}
                    countries={countries}
                    years={years}
                    categoryKey={categoryKey}
                    networks={networksConfig}
                    pageTitle={title}
                />
            </Suspense>
        </div>
    );
}
