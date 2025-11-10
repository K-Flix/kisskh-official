
import { getItems, getGenres, getCountries } from '@/lib/data';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { networksConfig } from '@/lib/networks';
import { NetworkCard } from '@/components/network-card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { DiscoverClientPage } from '@/components/discover-client-page';

interface DiscoverPageProps {
    searchParams: {
        category?: string;
        title?: string;
        [key: string]: string | string[] | undefined;
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

    const categoryKey = category || 'discover_all';
    const initialItems = await getItems(categoryKey, 1, false, true, flatFilters);
    const genres = await getGenres();
    const countries = await getCountries();

    const years = Array.from({ length: new Date().getFullYear() - 1900 + 1 }, (_, i) => (new Date().getFullYear() - i).toString());

    return (
        <div className="container py-8 space-y-8">
            {category ? (
                <h1 className="text-3xl font-bold">{title || 'Discover'}</h1>
            ) : (
                <div>
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-1.5 h-7 bg-primary rounded-full" />
                        <h2 className="text-2xl font-bold">Browse by Network</h2>
                    </div>
                    <Carousel
                        opts={{
                        align: 'start',
                        loop: false,
                        }}
                        className="w-full"
                    >
                        <CarouselContent>
                        {networksConfig.map((network) => (
                            <CarouselItem key={network.name} className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/6">
                            <NetworkCard network={network} />
                            </CarouselItem>
                        ))}
                        </CarouselContent>
                        <CarouselPrevious className="ml-12" />
                        <CarouselNext className="mr-12" />
                    </Carousel>
                </div>
            )}
            
            <Suspense fallback={<DiscoverSkeleton />}>
                <DiscoverClientPage
                    initialItems={initialItems}
                    initialFilters={flatFilters}
                    genres={genres}
                    countries={countries}
                    years={years}
                    categoryKey={categoryKey}
                />
            </Suspense>
        </div>
    );
}
