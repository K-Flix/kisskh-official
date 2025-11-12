
import { notFound } from 'next/navigation';
import { getPersonById } from '@/lib/data';
import type { Metadata } from 'next';
import { PersonPageClient } from '@/components/person-page-client';

interface PersonPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: PersonPageProps): Promise<Metadata> {
  const personId = parseInt(params.id, 10);
  if (isNaN(personId)) {
    return {
      title: 'Not Found',
    };
  }
  const person = await getPersonById(personId);

  if (!person) {
    return {
      title: 'Not Found',
    };
  }

  return {
    title: `${person.name} - kisskh`,
    description: person.biography,
    openGraph: {
      title: `${person.name} - kisskh`,
      description: person.biography,
      images: [
        {
          url: person.profile_path,
          width: 500,
          height: 750,
          alt: person.name,
        },
      ],
    },
  };
}

export default async function PersonPage({ params }: PersonPageProps) {
  const personId = parseInt(params.id, 10);
  if (isNaN(personId)) {
    notFound();
  }

  const person = await getPersonById(personId);

  if (!person) {
    notFound();
  }

  return (
    <div className="container py-8 pt-24">
      <PersonPageClient person={person} />
    </div>
  );
}
