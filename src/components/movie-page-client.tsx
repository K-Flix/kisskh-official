
'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import type { MovieDetails } from '@/lib/types';
import { ActorCard } from '@/components/actor-card';
import { MovieCarousel } from '@/components/movie-carousel';
import { ShowHero } from './show-hero';
import { X, ArrowLeft, Download, ChevronDown } from 'lucide-react';
import { Dialog, DialogContent } from './ui/dialog';
import { Button } from './ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface MoviePageClientProps {
  movie: MovieDetails;
}

const servers = [
    { name: 'Vidstorm', displayName: 'Primary' },
    { name: 'VidSrcV2', displayName: 'Alternate 1' },
    { name: 'Videasy', displayName: 'Alternate 2' },
    { name: 'VidSrcMe', displayName: 'Alternate 3' },
    { name: 'VidPlus', displayName: 'Alternate 4' },
    { name: 'MoviesAPI', displayName: 'Alternate 5' },
    { name: 'VidLink', displayName: 'Alternate 6' }
  ];

export function MoviePageClient({ movie }: MoviePageClientProps) {
  const [showPlayer, setShowPlayer] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [selectedServer, setSelectedServer] = useState('Vidstorm');
  const similarSectionRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const getPlayerUrl = () => {
    const id = movie.id;

    switch (selectedServer) {
        case 'Vidstorm':
            return `https://vidstorm.ru/movie/${id}`;
        case 'VidSrcV2':
            return `https://vidsrc.cc/v2/embed/movie/${id}?autoPlay=true`;
        case 'Videasy':
            return `https://player.videasy.net/movie/${id}?autoplay=true`;
        case 'VidSrcMe':
            return `https://vidsrcme.ru/embed/movie?tmdb=${id}`;
        case 'VidPlus':
            return `https://player.vidplus.to/embed/movie/${id}?autoplay=true`;
        case 'MoviesAPI':
            return `https://moviesapi.club/movie/${id}`;
        case 'VidLink':
            return `https://vidlink.pro/movie/${id}`;
        default:
            return `https://vidstorm.ru/movie/${id}`;
    }
  };

  const videoUrl = getPlayerUrl();
  const trailerUrl = movie.trailer_url ? `${movie.trailer_url}?autoplay=1&rel=0` : '';
  const downloadUrl = `https://dl.vidsrc.vip/movie/${movie.id}`;
  
  const handlePlay = () => {
    setShowPlayer(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSimilarsClick = () => {
    similarSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };


  return (
    <div className="text-white">
      {showPlayer ? (
        <div className="relative w-full min-h-screen">
             <Image
                src={movie.backdrop_path}
                alt={`Backdrop for ${movie.title}`}
                fill
                priority
                className="object-cover object-top opacity-30"
            />
            <div className="absolute inset-0 bg-background/70 backdrop-blur-md" />
            <div className="relative z-10">
                <div className="container relative flex justify-between items-center h-16 px-4">
                    <button onClick={() => setShowPlayer(false)} className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
                        <ArrowLeft className="w-6 h-6"/>
                        <span className="font-semibold">Back to details</span>
                    </button>
                    <button
                        onClick={() => setShowPlayer(false)}
                        className="z-10 text-white bg-background/50 rounded-full p-1 hover:bg-background/80 transition-colors"
                        aria-label="Close player"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <div className="relative aspect-video w-full max-w-4xl mx-auto mt-4">
                <iframe
                    src={videoUrl}
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0 md:rounded-lg bg-black"
                    key={selectedServer}
                ></iframe>
                </div>
                <div className="container max-w-4xl mx-auto mt-4">
                  <div className="grid grid-cols-1 items-center gap-4 bg-secondary/50 p-3 rounded-lg border-border/50">
                    <Select value={selectedServer} onValueChange={setSelectedServer}>
                        <SelectTrigger className="w-full bg-background border-0 focus:ring-2 focus:ring-primary">
                            <SelectValue>
                              Server: {servers.find(s => s.name === selectedServer)?.displayName}
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            {servers.map(({ name, displayName }) => (
                                <SelectItem key={name} value={name}>
                                    {displayName}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                  </div>
                </div>
            </div>
        </div>
      ) : (
        <>
            <div className="relative h-[50vh] md:h-[85vh] w-full">
                <button onClick={() => router.back()} className="absolute top-6 left-4 md:left-6 z-50 flex items-center justify-center bg-black/30 p-2 rounded-full hover:bg-black/50 transition-colors">
                    <ArrowLeft className="w-6 h-6 text-white"/>
                    <span className="sr-only">Back</span>
                </button>
                
                <div className="absolute inset-0 h-full w-full">
                    <Image
                        src={movie.backdrop_path}
                        alt={`Backdrop for ${movie.title}`}
                        fill
                        priority
                        className="object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                </div>
                
                <div className="relative z-10 flex h-full items-end">
                    <div className="container pb-8 md:pb-24">
                         <ShowHero 
                            show={movie} 
                            onPlayClick={handlePlay} 
                            onTrailerClick={() => setShowTrailer(true)}
                        >
                             <Tooltip delayDuration={200}>
                                <TooltipTrigger asChild>
                                    <Button asChild variant="secondary" size="icon" className="rounded-full w-11 h-11 bg-black/20 text-white hover:bg-black/40 border border-white/20 backdrop-blur-sm">
                                        <Link href={downloadUrl} target="_blank">
                                            <Download />
                                        </Link>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Download</p>
                                </TooltipContent>
                            </Tooltip>
                            
                            <Button onClick={handleSimilarsClick} variant="secondary" className="bg-black/20 text-white hover:bg-black/40 border border-white/20 backdrop-blur-sm px-4">
                                Similars
                            </Button>
                        </ShowHero>
                    </div>
                </div>
            </div>
             <div className="container py-8 space-y-12 md:mt-0 relative z-10" ref={similarSectionRef}>
                {movie.cast && movie.cast.length > 0 && <ActorCard actors={movie.cast} />}
                {movie.similar && movie.similar.length > 0 && (
                  <MovieCarousel title="Similars" movies={movie.similar} />
                )}
            </div>
        </>
      )}

      <Dialog open={showTrailer} onOpenChange={setShowTrailer}>
          <DialogContent className="bg-black border-0 p-0 max-w-4xl w-full aspect-video">
               <iframe
                  src={trailerUrl}
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0 rounded-lg"
              ></iframe>
          </DialogContent>
      </Dialog>
    </div>
  );
}
