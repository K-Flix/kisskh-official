
import { getItems } from '@/lib/data';
import { endpoints } from '@/lib/endpoints';
import { notFound } from 'next/navigation';
import { CategoryClientPage } from '@/components/category-client-page';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import type { Metadata } from 'next';

interface CategoryPageProps {
  params: {
    slug: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata({ params, searchParams }: CategoryPageProps): Promise<Metadata> {
  const endpoint = endpoints.find(e => e.key === params.slug);
  const title = endpoint?.title || params.slug.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  const page = searchParams['page'] || '1';
  const canonicalUrl = `/category/${params.slug}${page === '1' ? '' : `?page=${page}`}`;

  return {
    title: `${title} - kisskh`,
    description: `Browse all items in the ${title} category.`,
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

function CategorySkeleton() {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 18 }).map((_, i) => (
                <div key={i}>
                    <Skeleton className="aspect-[2/3] w-full" />
                    <Skeleton className="h-4 w-3/4 mt-2" />
                </div>
            ))}
        </div>
    )
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = params;
  const endpoint = endpoints.find(e => e.key === slug);

  if (!endpoint) {
    notFound();
  }

  const flatFilters: Record<string, string> = {};
  for (const key in searchParams) {
    const value = searchParams[key];
    if (typeof value === 'string') {
        flatFilters[key] = value;
    }
  }

  const initialItems = await getItems(slug, 1, false, true, flatFilters);
  const title = endpoint.title;
  
  return (
    <div className="container py-8 pt-24">
      <h1 className="text-3xl font-bold mb-8">{title}</h1>
      <Suspense fallback={<CategorySkeleton />}>
        <CategoryClientPage initialItems={initialItems} slug={slug} />
      </Suspense>
    </div>
  );
}
