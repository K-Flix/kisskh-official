
import { notFound } from 'next/navigation';
import { getShowById } from '@/lib/data';
import { ShowPageClient } from '@/components/show-page-client';
import type { Metadata } from 'next';
import { JsonLd } from '@/components/JsonLd';
import type { TVSeries as TVSeriesSchema } from 'schema-dts';

interface ShowPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: ShowPageProps): Promise<Metadata> {
  const showId = parseInt(params.id, 10);
  if (isNaN(showId)) {
    return {
      title: 'Not Found',
    };
  }
  const show = await getShowById(showId);

  if (!show) {
    return {
      title: 'Not Found',
      description: 'The TV show you are looking for could not be found.',
    };
  }

  return {
    title: `${show.title} - kisskh`,
    description: show.overview,
    openGraph: {
      title: `${show.title} - kisskh`,
      description: show.overview,
      images: [
        {
          url: show.backdrop_path,
          width: 1280,
          height: 720,
          alt: show.title,
        },
        {
          url: show.poster_path,
          width: 500,
          height: 750,
          alt: show.title,
        },
      ],
    },
    alternates: {
      canonical: `/tv/${show.id}`,
    }
  };
}

export default async function ShowPage({ params }: ShowPageProps) {
  const showId = parseInt(params.id, 10);
  if (isNaN(showId)) {
    notFound();
  }
  
  const show = await getShowById(showId);

  if (!show) {
    notFound();
  }

  const showJsonLd: TVSeriesSchema = {
    '@type': 'TVSeries',
    name: show.title,
    description: show.overview,
    image: show.poster_path,
    datePublished: show.release_date,
    numberOfSeasons: show.number_of_seasons,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: show.vote_average,
      bestRating: 10,
      ratingCount: show.popularity, // Using popularity as a proxy
    },
    actor: show.cast?.slice(0, 10).map(a => ({ '@type': 'Person', name: a.name })),
    genre: show.genres.map(g => g.name),
  };

  return (
    <>
      <JsonLd data={showJsonLd} />
      <div className="relative">
        <div className="md:px-0">
              <ShowPageClient show={show} />
          </div>
      </div>
    </>
  );
}
