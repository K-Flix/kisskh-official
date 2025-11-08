'use client';

import { useWatchlist } from '@/context/watchlist-context';
import { MovieCard } from '@/components/movie-card';
import { Film } from 'lucide-react';

export default function WatchlistPage() {
  const { watchlist } = useWatchlist();

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">My Watchlist</h1>
      {watchlist.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {watchlist.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center py-20 border-2 border-dashed rounded-lg">
            <Film className="w-16 h-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold">Your Watchlist is Empty</h2>
            <p className="text-muted-foreground mt-2">Add movies to your watchlist to see them here.</p>
        </div>
      )}
    </div>
  );
}
