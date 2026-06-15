import { App } from '@/App';
import { materialCategories } from '@/data/site';

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

  return <App initialCatalogSlug={slug} />;
}
