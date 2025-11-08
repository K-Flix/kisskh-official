
import { notFound } from 'next/navigation';
import { getShowById } from '@/lib/data';
import { ShowPageClient } from '@/components/show-page-client';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';


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
      <Link href="/tv" className="absolute top-4 left-4 z-20 bg-background/50 p-2 rounded-full hover:bg-background/80 transition-colors">
        <ArrowLeft className="w-6 h-6"/>
        <span className="sr-only">Back to TV shows</span>
      </Link>
      <ShowPageClient show={show} />
    </div>
  );
}
