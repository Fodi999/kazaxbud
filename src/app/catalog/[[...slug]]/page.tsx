import { App } from '@/App';

export default async function CatalogPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  const initialCatalogSlug = slug?.[0] ?? 'all';

  return <App initialCatalogSlug={initialCatalogSlug} />;
}
