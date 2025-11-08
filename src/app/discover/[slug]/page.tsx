
import { getItems, endpoints } from '@/lib/data';
import { MovieCard } from '@/components/movie-card';
import { notFound } from 'next/navigation';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = params;
  const endpoint = endpoints.find((e) => e.key === slug);

  if (!endpoint) {
    notFound();
  }

  const items = await getItems(slug);

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">{endpoint.title}</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
        {items.map((item) => (
          <MovieCard key={item.id} movie={item} />
        ))}
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const categories = ['k_drama', 'c_drama', 'anime'];
  return categories.map((slug) => ({
    slug,
  }));
}
