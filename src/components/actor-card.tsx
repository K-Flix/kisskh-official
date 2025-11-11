
import Image from 'next/image';
import type { CastMember } from '@/lib/types';
import { User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';

interface ActorCardProps {
  actor: CastMember;
}

function SingleActorCard({ actor }: ActorCardProps) {
  return (
    <Card className="bg-secondary border-0 text-center shrink-0 w-full overflow-hidden">
        <div className="relative aspect-[2/3] w-full">
            {actor.profile_path ? (
            <Image
                src={actor.profile_path}
                alt={actor.name}
                fill
                className="object-cover rounded-t-lg"
                sizes="(max-width: 768px) 33vw, 12.5vw"
            />
            ) : (
            <div className='w-full h-full bg-muted rounded-t-lg flex items-center justify-center'>
                <User className="w-8 h-8 text-muted-foreground" />
            </div>
            )}
      </div>
      <CardContent className="p-2">
        <p className="font-semibold text-sm truncate">{actor.name}</p>
        <p className="text-xs text-muted-foreground truncate">{actor.character}</p>
      </CardContent>
    </Card>
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
              slidesToScroll: 'auto',
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {actors.map((member) => (
                <CarouselItem key={member.credit_id} className="basis-1/3 sm:basis-1/4 md:basis-1/5 lg:basis-1/6 xl:basis-1/8 pl-4">
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
