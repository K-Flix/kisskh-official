
'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MovieCard } from '@/components/movie-card';
import { Movie, Show, Genre, Country, NetworkConfig } from '@/lib/types';
import { getItems } from '@/lib/data';
import { Loader2, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { DiscoverFilters } from './discover-filters';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { NetworkCard } from '@/components/network-card';

interface DiscoverClientPageProps {
  initialItems: (Movie | Show)[];
  initialFilters: Record<string, string | undefined>;
  genres: Genre[];
  countries: Country[];
  years: string[];
  categoryKey: string;
  networks: NetworkConfig[];
  pageTitle?: string;
}

export function DiscoverClientPage({ 
  initialItems, 
  initialFilters, 
  genres, 
  countries, 
  years, 
  categoryKey,
  networks,
  pageTitle
}: DiscoverClientPageProps) {
  const [items, setItems] = useState(initialItems);
  const [page, setPage] = useState(2);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialItems.length > 0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const observer = useRef<IntersectionObserver>();

  const lastItemRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreItems();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );
  
  const loadMoreItems = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    const currentParams = new URLSearchParams(Array.from(searchParams.entries()));
    const filters: Record<string, string> = {};
    currentParams.forEach((value, key) => {
        if(key !== 'category' && key !== 'title') {
            filters[key] = value;
        }
    });

    const hasFilters = Object.keys(filters).length > 0;
    const currentCategory = currentParams.get('category');
    const keyToFetch = currentCategory || (hasFilters ? 'discover_all' : 'trending_today');

    const newItems = await getItems(keyToFetch, page, false, true, filters);
    if (newItems.length > 0) {
      setItems((prev) => [...prev, ...newItems]);
      setPage((prev) => prev + 1);
    } else {
      setHasMore(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    setItems(initialItems);
    setPage(2);
    setHasMore(initialItems.length > 0);
  }, [searchParams, initialItems]);


  const handleFilterChange = useCallback((key: string, value: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    
    if (value && value !== 'all') {
      current.set(key, value);
    } else {
      current.delete(key);
    }
    
    current.delete('category');
    current.delete('title');
    
    const search = current.toString();
    const query = search ? `?${search}` : "";

    router.push(`/discover${query}`);
  }, [searchParams, router]);

  const handleNetworkSelect = (network: NetworkConfig) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    
    const networkIds = network.networkIds?.join('|');
    const providerIds = network.providerIds?.join('|');
    
    const currentNetworkFilter = current.get('with_networks');
    const isAlreadySelected = currentNetworkFilter === networkIds;

    // If the network is already selected, deselect it by removing the filters
    if (isAlreadySelected) {
        current.delete('with_networks');
        current.delete('with_watch_providers');
    } else {
        if (networkIds) current.set('with_networks', networkIds);
        if (providerIds) current.set('with_watch_providers', providerIds);
    }
    
    current.delete('category');
    current.delete('title');
    
    const search = current.toString();
    const query = search ? `?${search}` : "";

    router.push(`/discover${query}`);
  }

  const handleReset = useCallback(() => {
    router.push('/discover');
  }, [router]);

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

  const isDefaultView = !searchParams.get('category') && Object.keys(initialFilters).length === 0;

  const selectedNetworkId = searchParams.get('with_networks');

  return (
    <div className="space-y-8">
      {pageTitle ? (
          <h1 className="text-3xl font-bold">{pageTitle}</h1>
      ) : isDefaultView ? (
          <div>
              <div className="flex items-center space-x-3 mb-4">
                  <div className="w-1.5 h-7 bg-primary rounded-full" />
                  <h2 className="text-2xl font-bold">Browse by Network</h2>
              </div>
              <Carousel opts={{ align: 'start', loop: false }} className="w-full">
                  <CarouselContent>
                  {networks.map((network) => (
                      <CarouselItem key={network.name} className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/6">
                          <NetworkCard 
                            network={network} 
                            onNetworkSelect={handleNetworkSelect} 
                            isActive={selectedNetworkId === network.networkIds?.join('|')}
                          />
                      </CarouselItem>
                  ))}
                  </CarouselContent>
                  <CarouselPrevious className="ml-12" />
                  <CarouselNext className="mr-12" />
              </Carousel>
          </div>
      ) : null}

      <DiscoverFilters
        genres={genres}
        countries={countries}
        years={years}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
        currentFilters={initialFilters}
      />

      {items.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
            {items.map((item, index) => {
            if (items.length === index + 1) {
                return <div ref={lastItemRef} key={item.id}><MovieCard movie={item} /></div>;
            }
            return <MovieCard key={item.id} movie={item} />;
            })}
        </div>
      ) : (
        <div className="text-center py-20">
            <h2 className="text-2xl font-semibold">No results found</h2>
            <p className="text-muted-foreground mt-2">Try adjusting your filters.</p>
        </div>
      )}

      {loading && (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}
       <Button
        size="icon"
        onClick={scrollToTop}
        className={cn(
          'fixed bottom-8 right-8 z-50 rounded-full transition-opacity duration-300',
          showBackToTop ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        aria-label="Back to top"
      >
        <ChevronUp className="w-6 h-6" />
      </Button>
    </div>
  );
}

    