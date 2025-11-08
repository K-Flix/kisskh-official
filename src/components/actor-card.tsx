
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
          <h2 className="text-2xl font-bold mb-4 font-headline flex items-center">
            <span className="w-1 h-7 bg-primary mr-3"></span>
            Cast
          </h2>
          <Carousel
            opts={{
              align: 'start',
              loop: false,
            }}
            className="w-full"
          >
            <CarouselContent>
              {actors.map((member) => (
                <CarouselItem key={member.credit_id} className="basis-1/3 sm:basis-1/4 md:basis-1/6 lg:basis-[12.5%]">
                  <SingleActorCard actor={member} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="ml-12" />
            <CarouselNext className="mr-12" />
          </Carousel>
        </div>
    )
}
