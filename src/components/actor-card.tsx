import Image from 'next/image';
import type { CastMember } from '@/lib/types';
import { User } from 'lucide-react';

interface ActorCardProps {
  actor: CastMember;
}

export function ActorCard({ actor }: ActorCardProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
        {actor.profile_path ? (
          <Image
            src={actor.profile_path}
            alt={actor.name}
            width={128}
            height={128}
            className="object-cover w-full h-full"
          />
        ) : (
          <User className="w-12 h-12 text-muted-foreground" />
        )}
      </div>
      <div className="mt-2">
        <p className="font-semibold text-sm sm:text-base">{actor.name}</p>
        <p className="text-xs sm:text-sm text-muted-foreground">{actor.character}</p>
      </div>
    </div>
  );
}
