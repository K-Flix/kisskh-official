
import { notFound } from 'next/navigation';
import { getShowById } from '@/lib/data';
import { ShowPageClient } from '@/components/show-page-client';

interface ShowPageProps {
  params: {
    id: string;
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
