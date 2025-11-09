
'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import type { Movie, Show } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface WatchlistContextType {
  watchlist: (Movie | Show)[];
  addToWatchlist: (movie: Movie | Show) => void;
  removeFromWatchlist: (movieId: number) => void;
  isInWatchlist: (movieId: number) => boolean;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export function WatchlistProvider({ children }: { children: ReactNode }) {
  const [watchlist, setWatchlist] = useState<(Movie | Show)[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedWatchlist = localStorage.getItem('kisskh-watchlist');
      if (storedWatchlist) {
        setWatchlist(JSON.parse(storedWatchlist));
      }
    } catch (error) {
      console.error('Failed to parse watchlist from localStorage', error);
      setWatchlist([]);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('kisskh-watchlist', JSON.stringify(watchlist));
    } catch (error) {
      console.error('Failed to save watchlist to localStorage', error);
    }
  }, [watchlist]);

  const addToWatchlist = useCallback((movie: Movie | Show) => {
    setWatchlist((prev) => {
      if (prev.find((item) => item.id === movie.id)) {
        return prev;
      }
      toast({
        title: 'Added to Watchlist',
        description: `${movie.title} has been added to your watchlist.`,
      });
      return [movie, ...prev];
    });
  }, [toast]);

  const removeFromWatchlist = useCallback((movieId: number) => {
    setWatchlist((prev) => {
      const movie = prev.find((item) => item.id === movieId);
      if (movie) {
        toast({
          title: 'Removed from Watchlist',
          description: `${movie.title} has been removed from your watchlist.`,
        });
      }
      return prev.filter((item) => item.id !== movieId);
    });
  }, [toast]);
    
  const isInWatchlist = useCallback((movieId: number) => {
    return watchlist.some((item) => item.id === movieId);
  }, [watchlist]);

  const value = useMemo(() => ({ watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist }), [watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist]);

  return (
    <WatchlistContext.Provider value={value}>
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const context = useContext(WatchlistContext);
  if (context === undefined) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
}
