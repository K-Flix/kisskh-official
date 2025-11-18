
'use client';

import Image from 'next/image';
import type { CastMember } from '@/lib/types';
import { User, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import Link from 'next/link';
import { Button } from './ui/button';
import { ViewAllCastDialog } from './view-all-cast-dialog';
import { useState } from 'react';

interface ActorCardProps {
  actor: CastMember;
}

function SingleActorCard({ actor }: ActorCardProps) {
  return (
    <Link href={`/person/${actor.id}`} className="block group">
      <Card className="bg-secondary border-0 text-center shrink-0 w-36 overflow-hidden">
          <div className="relative aspect-[2/3] w-full">
              {actor.profile_path ? (
              <Image
                  src={actor.profile_path}
                  alt={actor.name}
                  fill
                  loading="lazy"
                  className="object-cover rounded-t-lg transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, (max-width: 1024px) 20vw, 14vw"
              />
              ) : (
              <div className='w-full h-full bg-muted rounded-t-lg flex items-center justify-center'>
                  <User className="w-8 h-8 text-muted-foreground" />
              </div>
              )}
        </div>
        <CardContent className="p-2">
          <p className="font-semibold text-sm truncate group-hover:text-primary">{actor.name}</p>
          <p className="text-xs text-muted-foreground truncate">{actor.character}</p>
        </CardContent>
      </Card>
    </Link>
  );
}

export function ActorCard({ actors }: { actors: CastMember[] }) {
    const [isDialogOpen, setDialogOpen] = useState(false);
    
    if (!actors || actors.length === 0) return null;

    const visibleActors = actors.slice(0, 15);

    return (
        <div>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-1.5 h-7 bg-primary rounded-full" />
              <h2 className="text-2xl font-bold">Cast</h2>
            </div>
             {actors.length > 15 && (
                <Button variant="link" onClick={() => setDialogOpen(true)}>
                    View All <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            )}
          </div>
          <Carousel
            opts={{
              align: 'start',
              slidesToScroll: 5,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {visibleActors.map((member) => (
                <CarouselItem key={member.credit_id} className="pl-4 basis-auto">
                  <SingleActorCard actor={member} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
          <ViewAllCastDialog
            isOpen={isDialogOpen}
            onOpenChange={setDialogOpen}
            cast={actors}
          />
        </div>
    )
}
