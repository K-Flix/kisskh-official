
'use client';

import Image from 'next/image';
import { PersonDetails } from '@/lib/types';
import { ArrowLeft, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ExpandableText } from './expandable-text';
import { MovieCard } from './movie-card';

interface PersonPageClientProps {
  person: PersonDetails;
}

export function PersonPageClient({ person }: PersonPageClientProps) {
  const router = useRouter();

  return (
    <div>
        <button onClick={() => router.back()} className="flex items-center gap-2 mb-8 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
        </button>
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
            <div className="md:w-1/5 flex-shrink-0">
                <div className="aspect-[2/3] w-full max-w-sm mx-auto md:max-w-none relative overflow-hidden rounded-lg">
                    <Image
                        src={person.profile_path}
                        alt={person.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 80vw, 20vw"
                    />
                </div>
            </div>
            <div className="md:w-4/5">
                <h1 className="text-4xl md:text-5xl font-bold">{person.name}</h1>
                {person.birthday && (
                    <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>Born {new Date(person.birthday).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} in {person.place_of_birth}</span>
                    </div>
                )}
                <div className="mt-4 max-w-3xl">
                   <ExpandableText text={person.biography} />
                </div>
            </div>
        </div>

        <div className="mt-12">
             <div className="flex items-center space-x-3 mb-4">
                <div className="w-1.5 h-7 bg-primary rounded-full" />
                <h2 className="text-2xl font-bold">Known For</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
                {person.known_for.map((item) => (
                    <MovieCard key={item.id} movie={item} />
                ))}
            </div>
        </div>
    </div>
  );
}
