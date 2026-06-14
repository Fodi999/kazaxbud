import { App } from '@/App';
import { readSiteContent } from '@/lib/content-store';

export const dynamic = 'force-dynamic';

export default async function CatalogPage() {
  const content = await readSiteContent();

  return <App initialCatalogSlug="all" initialContent={content} />;
}
