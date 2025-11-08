'use client';

import { useEffect, useState } from 'react';
import type { Movie, Show } from '@/lib/types';
import { suggestSimilarShows } from '@/ai/flows/suggest-similar-shows';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Sparkles } from 'lucide-react';

interface SimilarShowsProps {
  item: Movie | Show;
}

export function SimilarShows({ item }: SimilarShowsProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await suggestSimilarShows({
          title: item.title,
          genre: item.genres.map(g => g.name).join(', '),
          description: item.overview,
        });
        setSuggestions(result.suggestions);
      } catch (err) {
        setError('Could not fetch suggestions at this time. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [item]);

  return (
    <Card className="bg-card/50">
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
            <Sparkles className='text-primary' />
            AI Suggested Shows
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-6 w-2/3" />
          </div>
        )}
        {error && (
            <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        {!loading && !error && suggestions.length > 0 && (
          <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 text-sm">
            {suggestions.map((title, index) => (
              <li key={index} className="p-2 rounded-md bg-secondary/50 truncate hover:bg-secondary transition-colors">{title}</li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
