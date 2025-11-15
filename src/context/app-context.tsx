
'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import type { Movie, Show } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { usePathname } from 'next/navigation';

interface AppContextType {
  // Watchlist
  watchlist: (Movie | Show)[];
  addToWatchlist: (movie: Movie | Show) => void;
  removeFromWatchlist: (movieId: number) => void;
  isInWatchlist: (movieId: number) => boolean;
  // Navigation
  previousPath: string | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [watchlist, setWatchlist] = useState<(Movie | Show)[]>([]);
  const { toast } = useToast();
  const pathname = usePathname();
  const [previousPath, setPreviousPath] = useState<string | null>(null);

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

  useEffect(() => {
    // Don't set a new previous path if it's a detail page, to avoid loops
    if (!pathname.startsWith('/movie/') && !pathname.startsWith('/tv/') && !pathname.startsWith('/person/')) {
      setPreviousPath(pathname);
    }
  }, [pathname]);

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

  const value = useMemo(() => ({ 
    watchlist, 
    addToWatchlist, 
    removeFromWatchlist, 
    isInWatchlist,
    previousPath
  }), [watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist, previousPath]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within a AppProvider');
  }
  return context;
}
