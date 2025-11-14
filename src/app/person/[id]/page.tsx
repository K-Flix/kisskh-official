
import { notFound } from 'next/navigation';
import { getPersonById } from '@/lib/data';
import type { Metadata } from 'next';
import { PersonPageClient } from '@/components/person-page-client';
import { JsonLd } from '@/components/JsonLd';
import type { Person as PersonSchema } from 'schema-dts';

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
      description: 'The person you are looking for could not be found.',
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
    alternates: {
      canonical: `/person/${person.id}`,
    }
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

  const personJsonLd: PersonSchema = {
    '@type': 'Person',
    name: person.name,
    description: person.biography,
    image: person.profile_path,
    birthDate: person.birthday || undefined,
    birthPlace: {
      '@type': 'Place',
      name: person.place_of_birth || undefined,
    },
  };

  return (
    <>
      <JsonLd data={personJsonLd} />
      <div className="container py-8 pt-24">
        <PersonPageClient person={person} />
      </div>
    </>
  );
}
