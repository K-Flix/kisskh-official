
'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "./ui/button";
import { Genre, Country } from "@/lib/types";

interface DiscoverFiltersProps {
    genres: Genre[];
    countries: Country[];
    years: string[];
    onFilterChange: (key: string, value: string) => void;
    onReset: () => void;
    currentFilters: Record<string, string | undefined>;
    isMediaTypeDisabled?: boolean;
}

export function DiscoverFilters({ genres, countries, years, onFilterChange, onReset, currentFilters, isMediaTypeDisabled }: DiscoverFiltersProps) {
    const sortOptions = [
        { value: 'popularity.desc', label: 'Popularity' },
        { value: 'vote_average.desc', label: 'Rating' },
        { value: 'primary_release_date.desc', label: 'Release Date' },
      ];

  return (
     <div>
        <div className="flex items-center space-x-3 mb-4">
            <div className="w-1.5 h-7 bg-primary rounded-full" />
            <h2 className="text-2xl font-bold">Detailed Search</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 bg-secondary/50 p-4 rounded-lg border border-border/50">
            <Select 
                value={currentFilters['media_type'] || 'all'} 
                onValueChange={(value) => onFilterChange('media_type', value)}
                disabled={isMediaTypeDisabled}
            >
                <SelectTrigger className="w-full bg-background border-border/80 focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed">
                    <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="movie">Movies</SelectItem>
                    <SelectItem value="tv">TV Shows</SelectItem>
                </SelectContent>
            </Select>
            <Select value={currentFilters['with_genres'] || 'all'} onValueChange={(value) => onFilterChange('with_genres', value)}>
                <SelectTrigger className="w-full bg-background border-border/80 focus:ring-2 focus:ring-primary">
                    <SelectValue placeholder="Genre" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Genres</SelectItem>
                    {genres.map((genre) => (
                        <SelectItem key={genre.id} value={genre.id.toString()}>{genre.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Select value={currentFilters['with_origin_country'] || 'all'} onValueChange={(value) => onFilterChange('with_origin_country', value)}>
                <SelectTrigger className="w-full bg-background border-border/80 focus:ring-2 focus:ring-primary">
                    <SelectValue placeholder="Country" />
                </SelectTrigger>
                <SelectContent>
                     <SelectItem value="all">All Countries</SelectItem>
                    {countries.map((country) => (
                        <SelectItem key={country.iso_3166_1} value={country.iso_3166_1}>{country.english_name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Select value={currentFilters['primary_release_year'] || 'all'} onValueChange={(value) => onFilterChange('primary_release_year', value)}>
                <SelectTrigger className="w-full bg-background border-border/80 focus:ring-2 focus:ring-primary">
                    <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    {years.map((year) => (
                        <SelectItem key={year} value={year}>{year}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Select value={currentFilters['sort_by'] || 'popularity.desc'} onValueChange={(value) => onFilterChange('sort_by', value)}>
                <SelectTrigger className="w-full bg-background border-border/80 focus:ring-2 focus:ring-primary">
                    <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                    {sortOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Button variant="ghost" className="w-full h-full" onClick={onReset}>Reset</Button>
        </div>
    </div>
  )
}
