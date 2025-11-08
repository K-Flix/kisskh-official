
import Image from 'next/image';
import type { CastMember } from '@/lib/types';
import { User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ActorCardProps {
  actor: CastMember;
}

export function ActorCard({ actor }: ActorCardProps) {
  return (
    <Card className="bg-secondary border-0 text-center shrink-0">
        <div className="relative aspect-[2/3] w-full">
            {actor.profile_path ? (
            <Image
                src={actor.profile_path}
                alt={actor.name}
                fill
                className="object-cover rounded-t-lg"
            />
            ) : (
            <div className='w-full h-full bg-muted rounded-t-lg flex items-center justify-center'>
                <User className="w-12 h-12 text-muted-foreground" />
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
