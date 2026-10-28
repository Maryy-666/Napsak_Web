import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://napsak.org';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = [
    '',
    '/ekipler',
    '/etkinlikler',
    '/faaliyetler',
    '/raporlar',
    '/dergiler',
    '/haberler',
    '/hakkimizda',
    '/katilim',
    '/iletisim',
    '/kvkk',
    '/cerez-politikasi',
    '/sss',
  ].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Fetch dynamic slugs if available
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"}/news`, { cache: 'no-store' });
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        json.data.forEach((item: any) => {
          if (item.slug) {
            routes.push({
              url: `${BASE_URL}/haberler/${item.slug}`,
              lastModified: new Date().toISOString().split('T')[0],
              changeFrequency: 'monthly' as any,
              priority: 0.7,
            });
          }
        });
      }
    }
  } catch (err) {
    // Ignore fetch error during static build
  }

  return routes;
}
