import { App } from '@/App';
import { materialCategories } from '@/data/site';
import { readSiteContent } from '@/lib/content-store';

export const dynamic = 'force-dynamic';

export function generateStaticParams() {
  return materialCategories.map((category) => ({
    slug: category.slug,
  }));
}

export default async function CatalogCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const content = await readSiteContent();

  return <App initialCatalogSlug={slug} initialContent={content} />;
}
