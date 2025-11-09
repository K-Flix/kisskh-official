
import { getItems } from '@/lib/data';
import { MovieCarousel } from '@/components/movie-carousel';
import { Separator } from '@/components/ui/separator';
import { CategoryClientPage } from '@/components/category-client-page';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface DiscoverPageProps {
    searchParams: {
        category?: string;
        title?: string;
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

async function DiscoverContent({ category, title }: { category: string, title: string }) {
    const initialItems = await getItems(category, 1, false, true);

    if (initialItems.length === 0) {
        return (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold">No results found for {title}</h2>
            <p className="text-muted-foreground mt-2">There are no items available in this category at the moment.</p>
          </div>
        );
    }
    
    return <CategoryClientPage initialItems={initialItems} slug={category} />
}

export default async function DiscoverPage({ searchParams }: DiscoverPageProps) {
    const { category, title } = searchParams;

    if (category) {
        return (
            <div className="container py-8">
                <h1 className="text-3xl font-bold mb-8">{title || 'Discover'}</h1>
                <Suspense fallback={<DiscoverSkeleton />}>
                    <DiscoverContent category={category} title={title || 'Content'} />
                </Suspense>
            </div>
        );
    }

    // Fallback to default discover page if no category is specified
    const trending = await getItems('trending_today', 1, false, true);
    const kDramas = await getItems('k_drama', 1, false, true);
    const cDramas = await getItems('c_drama', 1, false, true);
    const anime = await getItems('anime', 1, false, true);

    return (
        <div className="container py-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold mb-2">Discover</h1>
                <p className="text-muted-foreground">Discover the best movies and TV shows to watch, from trending series to popular K-Dramas, C-Dramas and Anime.</p>
            </div>
            <Separator />
            <MovieCarousel title="Trending" movies={trending} seeAllHref="/discover?category=trending_today&title=Trending Today" />
            <MovieCarousel title="K-Drama" movies={kDramas} seeAllHref="/discover?category=k_drama&title=K-Dramas" />
            <MovieCarousel title="C-Drama" movies={cDramas} seeAllHref="/discover?category=c_drama&title=C-Dramas" />
            <MovieCarousel title="Anime" movies={anime} seeAllHref="/discover?category=anime&title=Anime" />
        </div>
    );
}

