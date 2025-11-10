
import { getItems } from '@/lib/data';
import { MovieCarousel } from '@/components/movie-carousel';
import { Separator } from '@/components/ui/separator';
import { CategoryClientPage } from '@/components/category-client-page';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { networksConfig } from '@/lib/networks';
import { NetworkCard } from '@/components/network-card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

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

    return (
        <div className="container py-8 space-y-8">
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
            <div>
                <div className="flex items-center space-x-3 mb-4">
                    <div className="w-1.5 h-7 bg-primary rounded-full" />
                    <h2 className="text-2xl font-bold">Detailed Search</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button variant="outline">
                        Type <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                    <Button variant="outline">
                        Genre <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                    <Button variant="outline">
                        Country <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                    <Button variant="outline">
                        Years <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                    <Button variant="outline">
                        Sort By <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                    <Button variant="ghost">Reset</Button>
                </div>
            </div>
        </div>
    );
}
