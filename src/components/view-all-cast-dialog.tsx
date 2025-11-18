
'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CastMember } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { User } from 'lucide-react';

interface ViewAllCastDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  cast: CastMember[];
}

export function ViewAllCastDialog({ isOpen, onOpenChange, cast }: ViewAllCastDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">Full Cast</DialogTitle>
        </DialogHeader>
        <div className="flex-grow overflow-hidden">
          <ScrollArea className="h-full pr-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {cast.map((actor) => (
                <Link key={actor.credit_id} href={`/person/${actor.id}`} className="group" onClick={() => onOpenChange(false)}>
                  <div className="flex flex-col items-center text-center">
                    <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden bg-muted mb-2">
                      {actor.profile_path ? (
                        <Image
                          src={actor.profile_path}
                          alt={actor.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="w-10 h-10 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <p className="font-semibold text-sm group-hover:text-primary truncate w-full">{actor.name}</p>
                    <p className="text-xs text-muted-foreground truncate w-full">{actor.character}</p>
                  </div>
                </Link>
              ))}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
