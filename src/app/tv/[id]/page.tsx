import { notFound } from 'next/navigation';
import { getShowById } from '@/lib/data';
import { ShowHero } from '@/components/show-hero';
import { EpisodeList } from '@/components/episode-list';
import { MovieCarousel } from '@/components/movie-carousel';
import { ActorCard } from '@/components/actor-card';
import { SimilarShows } from '@/components/similar-shows';

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
    <div className="flex flex-col">
      <ShowHero show={show} />
      <div className="container py-8 md:py-12 space-y-12">
        <EpisodeList seasons={show.seasons} showId={show.id} />
        
        <div>
            <h2 className="text-2xl font-bold mb-4 font-headline flex items-center">
                <span className="w-1 h-7 bg-primary mr-3"></span>
                Cast
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4 sm:gap-6">
                {show.cast.slice(0, 8).map((member) => (
                    <ActorCard key={member.name} actor={member} />
                ))}
            </div>
        </div>
        
        <SimilarShows movie={show} />

        {show.similar && show.similar.length > 0 && (
            <MovieCarousel title="You may also like" movies={show.similar} />
        )}
      </div>
    </div>
  );
}
