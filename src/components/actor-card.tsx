
import Image from 'next/image';
import type { CastMember } from '@/lib/types';
import { User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import Link from 'next/link';

interface ActorCardProps {
  actor: CastMember;
}

function SingleActorCard({ actor }: ActorCardProps) {
  return (
    <Link href={`/person/${actor.id}`} className="block">
      <Card className="bg-secondary border-0 text-center shrink-0 w-full overflow-hidden group">
          <div className="relative aspect-[2/3] w-full">
              {actor.profile_path ? (
              <Image
                  src={actor.profile_path}
                  alt={actor.name}
                  fill
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
    return (
        <div>
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-1.5 h-7 bg-primary rounded-full" />
            <h2 className="text-2xl font-bold">Cast</h2>
          </div>
          <Carousel
            opts={{
              align: 'start',
              slidesToScroll: 5,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {actors.map((member) => (
                <CarouselItem key={member.credit_id} className="pl-4 basis-1/3 sm:basis-1/5 md:basis-1/7 lg:basis-1/8">
                  <SingleActorCard actor={member} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
    )
}
