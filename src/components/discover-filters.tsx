
'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "./ui/button";

export function DiscoverFilters() {
  return (
     <div>
        <div className="flex items-center space-x-3 mb-4">
            <div className="w-1.5 h-7 bg-primary rounded-full" />
            <h2 className="text-2xl font-bold">Detailed Search</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 bg-secondary/50 p-3 rounded-lg border-border/50">
            <Select>
                <SelectTrigger className="w-full bg-background border-0 focus:ring-2 focus:ring-primary">
                    <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="movie">Movies</SelectItem>
                    <SelectItem value="tv">TV Shows</SelectItem>
                </SelectContent>
            </Select>
            <Select>
                <SelectTrigger className="w-full bg-background border-0 focus:ring-2 focus:ring-primary">
                    <SelectValue placeholder="Genre" />
                </SelectTrigger>
                <SelectContent>
                    {/* Genres will be populated here */}
                </SelectContent>
            </Select>
            <Select>
                <SelectTrigger className="w-full bg-background border-0 focus:ring-2 focus:ring-primary">
                    <SelectValue placeholder="Country" />
                </SelectTrigger>
                <SelectContent>
                    {/* Countries will be populated here */}
                </SelectContent>
            </Select>
            <Select>
                <SelectTrigger className="w-full bg-background border-0 focus:ring-2 focus:ring-primary">
                    <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                    {/* Years will be populated here */}
                </SelectContent>
            </Select>
            <Select>
                <SelectTrigger className="w-full bg-background border-0 focus:ring-2 focus:ring-primary">
                    <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                    {/* Sort options will be populated here */}
                </SelectContent>
            </Select>
            <Button variant="ghost" className="w-full h-full">Reset</Button>
        </div>
    </div>
  )
}
