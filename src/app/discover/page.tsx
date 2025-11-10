
import { getItems, getGenres, getCountries } from '@/lib/data';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { networksConfig } from '@/lib/networks';
import { DiscoverClientPage } from '@/components/discover-client-page';
import type { Metadata } from 'next';

interface DiscoverPageProps {
    searchParams: {
        [key: string]: string | string[] | undefined;
    };
}

export async function generateMetadata({ searchParams }: DiscoverPageProps): Promise<Metadata> {
    const { with_genres, primary_release_year, with_origin_country, with_networks } = searchParams;

    let description = 'Discover new movies and TV shows.';
    if (with_genres) description += ` Filtered by genre.`;
    if (primary_release_year) description += ` From the year ${primary_release_year}.`;
    if (with_origin_country) description += ` From a specific country.`;
    if (with_networks) description += ` From a specific network.`

    return {
        title: `Discover - kisskh`,
        description: description,
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
    // Flatten searchParams
    const flatFilters: Record<string, string> = {};
    for (const key in searchParams) {
        const value = searchParams[key];
        if (Array.isArray(value)) {
            flatFilters[key] = value[0];
        } else if (value) {
            flatFilters[key] = value;
        }
    }
    
    const initialItems = await getItems('discover_all', 1, false, true, flatFilters);
    const genres = await getGenres();
    const countries = await getCountries();

    const years = Array.from({ length: new Date().getFullYear() - 1900 + 1 }, (_, i) => (new Date().getFullYear() - i).toString());

    return (
        <div className="container py-8 space-y-8 pt-24">
            <Suspense fallback={<DiscoverSkeleton />}>
                <DiscoverClientPage
                    initialItems={initialItems}
                    genres={genres}
                    countries={countries}
                    years={years}
                    networks={networksConfig}
                />
            </Suspense>
        </div>
    );
}
