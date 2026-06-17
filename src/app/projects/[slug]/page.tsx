import type { Metadata } from 'next';
import { App } from '@/App';
import { defaultSiteContent } from '@/data/site';

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return defaultSiteContent.projects
    .map((project) => project.slug)
    .filter(Boolean)
    .map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = defaultSiteContent.projects.find((item) => item.slug === slug);
  return {
    title: project?.seoTitle || project?.pageTitle || project?.title || 'Проект ALMABUILD',
    description: project?.seoDescription || project?.meta || 'Кейс коммерческой отделки и поставки материалов в Алматы.',
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  return <App initialCatalogSlug={null} initialProjectSlug={slug} />;
}
