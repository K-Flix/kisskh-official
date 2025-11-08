'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { Movie } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface WatchlistContextType {
  watchlist: Movie[];
  addToWatchlist: (movie: Movie) => void;
  removeFromWatchlist: (movieId: number) => void;
  isInWatchlist: (movieId: number) => boolean;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export function WatchlistProvider({ children }: { children: ReactNode }) {
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedWatchlist = localStorage.getItem('streamverse-watchlist');
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
      localStorage.setItem('streamverse-watchlist', JSON.stringify(watchlist));
    } catch (error) {
      console.error('Failed to save watchlist to localStorage', error);
    }
  }, [watchlist]);

  const addToWatchlist = useCallback((movie: Movie) => {
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
          variant: 'destructive',
        });
      }
      return prev.filter((item) => item.id !== movieId);
    });
  }, [toast]);
    
  const isInWatchlist = useCallback((movieId: number) => {
    return watchlist.some((item) => item.id === movieId);
  }, [watchlist]);

  return (
    <WatchlistContext.Provider value={{ watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist }}>
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
