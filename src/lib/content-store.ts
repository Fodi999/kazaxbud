import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { defaultSiteContent, type SiteContent } from '@/data/site';

export type Lead = {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  type: string;
  area: string;
  comment: string;
  items: string[];
};

const dataDir = path.join(process.cwd(), '.data');
const contentPath = path.join(dataDir, 'content.json');
const leadsPath = path.join(dataDir, 'leads.json');
const backendUrl = (process.env.KAZAXBUD_BACKEND_URL || 'https://ministerial-yetta-fodi999-c58d8823.koyeb.app').replace(/\/+$/, '');

function normalizeString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeStringArray(value: unknown) {
  return Array.isArray(value) ? value.map(normalizeString).filter(Boolean) : [];
}

export function normalizeSiteContent(value: unknown): SiteContent {
  const source = value && typeof value === 'object' ? value as Partial<SiteContent> : {};

  const materialCategories = Array.isArray(source.materialCategories)
    ? source.materialCategories.map((item, index) => ({
      index: normalizeString(item.index) || `[0:${index + 1}]`,
      slug: normalizeString(item.slug),
      title: normalizeString(item.title),
      text: normalizeString(item.text),
      bullets: normalizeStringArray(item.bullets),
      photo: normalizeString(item.photo),
    })).filter((item) => item.slug && item.title)
    : defaultSiteContent.materialCategories;

  const products = Array.isArray(source.products)
    ? source.products.map((item) => ({
      categorySlug: normalizeString(item.categorySlug),
      category: normalizeString(item.category),
      title: normalizeString(item.title),
      spec: normalizeString(item.spec),
      photo: normalizeString(item.photo),
    })).filter((item) => item.categorySlug && item.title)
    : defaultSiteContent.products;

  const kits = Array.isArray(source.kits)
    ? source.kits.map((item) => ({
      title: normalizeString(item.title),
      text: normalizeString(item.text),
      items: normalizeStringArray(item.items),
    })).filter((item) => item.title)
    : defaultSiteContent.kits;

  const projects = Array.isArray(source.projects)
    ? source.projects.map((item) => ({
      title: normalizeString(item.title),
      meta: normalizeString(item.meta),
      photo: normalizeString(item.photo),
    })).filter((item) => item.title)
    : defaultSiteContent.projects;

  return {
    materialCategories: materialCategories.length ? materialCategories : defaultSiteContent.materialCategories,
    products: products.length ? products : defaultSiteContent.products,
    kits: kits.length ? kits : defaultSiteContent.kits,
    projects: projects.length ? projects : defaultSiteContent.projects,
  };
}

export async function readSiteContent() {
  try {
    const response = await fetch(`${backendUrl}/public/almabuild/content`, {
      cache: 'no-store',
    });
    if (response.ok) {
      return normalizeSiteContent(await response.json());
    }
  } catch (error) {
    console.warn('Unable to load ALMABUILD content from backend', error);
  }

  try {
    const file = await readFile(contentPath, 'utf8');
    return normalizeSiteContent(JSON.parse(file));
  } catch {
    return defaultSiteContent;
  }
}

export async function writeSiteContent(content: unknown) {
  const normalized = normalizeSiteContent(content);
  await mkdir(dataDir, { recursive: true });
  await writeFile(contentPath, `${JSON.stringify(normalized, null, 2)}\n`, 'utf8');
  return normalized;
}

export async function readLeads() {
  try {
    const file = await readFile(leadsPath, 'utf8');
    const parsed = JSON.parse(file);
    return Array.isArray(parsed) ? parsed as Lead[] : [];
  } catch {
    return [];
  }
}

export async function createLead(form: FormData) {
  const lead: Lead = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    name: normalizeString(form.get('name')),
    phone: normalizeString(form.get('phone')),
    type: normalizeString(form.get('type')),
    area: normalizeString(form.get('area')),
    comment: normalizeString(form.get('comment')),
    items: normalizeStringArray(form.getAll('items')),
  };

  if (!lead.phone) {
    throw new Error('Phone is required');
  }

  const leads = await readLeads();
  const nextLeads = [lead, ...leads].slice(0, 300);
  await mkdir(dataDir, { recursive: true });
  await writeFile(leadsPath, `${JSON.stringify(nextLeads, null, 2)}\n`, 'utf8');
  return lead;
}
