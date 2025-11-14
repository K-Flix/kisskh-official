import { MetadataRoute } from 'next';
import { getItems } from '@/lib/data';
import { endpoints } from '@/lib/endpoints';

const VERCEL_URL = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static routes
  const staticRoutes = [
    '',
    '/movies',
    '/tv',
    '/discover',
    '/faq',
    '/privacy-policy',
    '/terms-of-service',
  ].map((route) => ({
    url: `${VERCEL_URL}${route}`,
    lastModified: new Date().toISOString(),
  }));

  // Dynamic category routes
  const categoryRoutes = endpoints.map((endpoint) => ({
    url: `${VERCEL_URL}/category/${endpoint.key}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }));
  
  // Dynamic item routes (movies, tv, people)
  const trendingItems = await getItems('trending_today');

  const itemRoutes = await Promise.all(
    trendingItems.slice(0, 50).map(async (item) => {
        let path = '';
        if (item.media_type === 'movie') {
            path = `/movie/${item.id}`;
        } else if (item.media_type === 'tv') {
            path = `/tv/${item.id}`;
        }
        
        return {
            url: `${VERCEL_URL}${path}`,
            lastModified: new Date().toISOString(),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        };
    })
  );

  return [...staticRoutes, ...categoryRoutes, ...itemRoutes];
}
