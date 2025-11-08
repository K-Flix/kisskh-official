
import { getItems } from '@/lib/data';
import { endpoints } from '@/lib/endpoints';
import { notFound } from 'next/navigation';
import { CategoryClientPage } from '@/components/category-client-page';

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

  const initialItems = await getItems(slug, 1);

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">{endpoint.title}</h1>
      <CategoryClientPage initialItems={initialItems} slug={slug} />
    </div>
  );
}

export async function generateStaticParams() {
    // Generate params for all discoverable endpoints
    return endpoints.map((endpoint) => ({
      slug: endpoint.key,
    }));
}
