import { App } from '@/App';
import { readSiteContent } from '@/lib/content-store';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const content = await readSiteContent();

  return <App initialCatalogSlug={null} initialContent={content} />;
}
