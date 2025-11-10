
import { notFound } from 'next/navigation';
import { getShowById } from '@/lib/data';
import { ShowPageClient } from '@/components/show-page-client';
import type { Metadata } from 'next';

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

  return (
    <div className="relative">
       <div className="md:px-0">
            <ShowPageClient show={show} />
        </div>
    </div>
  );
}
