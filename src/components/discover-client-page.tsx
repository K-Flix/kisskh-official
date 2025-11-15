
'use client';

import { useState, useRef, useCallback, useEffect, useMemo, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MovieCard } from '@/components/movie-card';
import { Movie, Show, Genre, Country, NetworkConfig } from '@/lib/types';
import { getItems } from '@/lib/data';
import { Loader2, ChevronUp, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { DiscoverFilters } from './discover-filters';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { NetworkCard } from '@/components/network-card';
import { useDebounce } from '@/hooks/use-debounce';
import { Skeleton } from './ui/skeleton';

interface DiscoverClientPageProps {
  initialItems: (Movie | Show)[];
  genres: Genre[];
  countries: Country[];
  years: string[];
  networks: NetworkConfig[];
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

export function DiscoverClientPage({ 
  initialItems, 
  genres, 
  countries, 
  years, 
  networks,
}: DiscoverClientPageProps) {
  const [items, setItems] = useState(initialItems);
  const [page, setPage] = useState(2);
  const [hasMore, setHasMore] = useState(initialItems.length > 0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const observer = useRef<IntersectionObserver>();

  const currentFilters = useMemo(() => {
    const params = new URLSearchParams(searchParams.toString());
    const filters: Record<string, string> = {};
    params.forEach((value, key) => {
        filters[key] = value;
    });
    return filters;
  }, [searchParams]);

  useEffect(() => {
    setItems(initialItems);
    setPage(2);
    setHasMore(initialItems.length > 0);
  }, [initialItems]);


  const handleFilterChange = useCallback((key: string, value: string) => {
    startTransition(() => {
        const newParams = new URLSearchParams(searchParams.toString());
        if (value && value !== 'all') {
            newParams.set(key, value);
        } else {
            newParams.delete(key);
        }
        const search = newParams.toString();
        const query = search ? `?${search}` : "";
        router.push(`/discover${query}`);
    });
  }, [searchParams, router]);


  const handleNetworkSelect = useCallback((network: NetworkConfig) => {
    startTransition(() => {
        const newParams = new URLSearchParams(searchParams.toString());
        const networkIds = network.networkIds?.join('|');
        const providerIds = network.providerIds?.join('|');

        const isCurrentlySelected = 
            (networkIds && newParams.get('with_networks') === networkIds) ||
            (providerIds && newParams.get('with_watch_providers') === providerIds);

        // Clear old network/provider filters before adding new ones
        newParams.delete('with_networks');
        newParams.delete('with_watch_providers');

        if (!isCurrentlySelected) {
            if (networkIds) newParams.set('with_networks', networkIds);
            if (providerIds) newParams.set('with_watch_providers', providerIds);
            
            // If it's a broadcast-only network, default to TV
            if (networkIds && (!providerIds || providerIds.length === 0)) {
                newParams.set('media_type', 'tv');
            } else {
                newParams.delete('media_type');
            }
        } else {
            newParams.delete('media_type');
        }
        
        const search = newParams.toString();
        const query = search ? `?${search}` : "";
        router.push(`/discover${query}`);
    });
  }, [searchParams, router]);

  const handleReset = useCallback(() => {
    startTransition(() => {
        router.push('/discover');
    });
  }, [router]);


  const loadMoreItems = useCallback(async () => {
    if (isLoadingMore || isPending || !hasMore) return;
    setIsLoadingMore(true);
      const newItems = await getItems('discover_all', page, false, false, currentFilters);
      if (newItems.length > 0) {
        setItems((prev) => [...prev, ...newItems]);
        setPage((prev) => prev + 1);
      } else {
        setHasMore(false);
      }
    setIsLoadingMore(false);
  }, [isLoadingMore, isPending, hasMore, page, currentFilters]);
  

  const lastItemRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoadingMore || isPending) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreItems();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoadingMore, isPending, hasMore, loadMoreItems]
  );

  const handleScroll = () => {
    if (window.scrollY > 400) {
      setShowBackToTop(true);
    } else {
      setShowBackToTop(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const selectedNetworkId = searchParams.get('with_networks');
  const selectedProviderId = searchParams.get('with_watch_providers');

  const selectedNetwork = networks.find(n => 
    (n.networkIds?.join('|') === selectedNetworkId && n.providerIds?.join('|') === selectedProviderId) ||
    (n.networkIds?.join('|') === selectedNetworkId && (!n.providerIds || !n.providerIds.length)) ||
    (n.providerIds?.join('|') === selectedProviderId && (!n.networkIds || !n.networkIds.length))
  );

  const isMediaTypeDisabled = selectedNetwork?.networkIds && selectedNetwork.networkIds.length > 0 && (!selectedNetwork.providerIds || selectedNetwork.providerIds.length === 0);

  return (
    <div className="space-y-8">
      <div>
          <div className="flex items-center space-x-3 mb-4">
              <div className="w-1.5 h-7 bg-primary rounded-full" />
              <h2 className="text-2xl font-bold">Browse by Network</h2>
          </div>
          <Carousel opts={{ align: 'start', slidesToScroll: 'auto' }} className="w-full">
              <CarouselContent className="-ml-4">
              {networks.map((network) => {
                  const networkIds = network.networkIds?.join('|');
                  const providerIds = network.providerIds?.join('|');
                  const isActive = (networkIds && selectedNetworkId === networkIds) || (providerIds && selectedProviderId === providerIds);
                  const hasActiveFilter = !!selectedNetworkId || !!selectedProviderId;

                  return (
                    <CarouselItem key={network.name} className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/6 pl-4">
                        <NetworkCard 
                          network={network} 
                          onClick={() => handleNetworkSelect(network)} 
                          isActive={isActive}
                          hasActiveFilter={hasActiveFilter}
                        />
                    </CarouselItem>
                  )
                })}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
          </Carousel>
      </div>

      <DiscoverFilters
        genres={genres}
        countries={countries}
        years={years}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
        currentFilters={currentFilters}
        isMediaTypeDisabled={isMediaTypeDisabled}
      />

        {isPending && <DiscoverSkeleton />}

        {!isPending && items.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
                {items.map((item, index) => {
                if (items.length === index + 1) {
                    return <div ref={lastItemRef} key={`${item.id}-${index}`}><MovieCard movie={item} /></div>;
                }
                return <MovieCard key={`${item.id}-${index}`} movie={item} />;
                })}
            </div>
        )}

      {!isPending && items.length === 0 && (
        <div className="text-center py-20">
            <h2 className="text-2xl font-semibold">No results found</h2>
            <p className="text-muted-foreground mt-2">Try adjusting your filters.</p>
        </div>
      )}

      {isLoadingMore && (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}
       <Button
        size="icon"
        onClick={scrollToTop}
        className={cn(
          'fixed bottom-8 right-8 z-50 rounded-full transition-opacity duration-300',
          {
            'opacity-100': showBackToTop,
            'opacity-0 pointer-events-none': !showBackToTop,
          }
        )}
        aria-label="Back to top"
      >
        <ChevronUp className="w-6 h-6" />
      </Button>
    </div>
  );
}
