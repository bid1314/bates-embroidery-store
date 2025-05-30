import { notFound } from 'next/navigation';
import Sections from '@/components/sections';
import { cacheKeys, cacheTTL, getOrSetCache } from '@/lib/upstash';
import { getTenantByDomain, getTenantPage } from '@/lib/supabase';
import type { Section } from '@/lib/types';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

async function getPageData(host: string, slugPath: string[]): Promise<Section[] | null> {
  const subdomain = host.split('.')[0];
  const tenant = await getTenantByDomain(subdomain);
  if (!tenant) return null;

  const slug = slugPath.join('/') || 'home';
  const cacheKey = cacheKeys.tenantSettings(tenant.id) + `:page:${slug}`;
  const page = await getOrSetCache(cacheKey, async () => {
    return getTenantPage(tenant.id, slug);
  }, cacheTTL.tenantSettings);

  if (!page || page.draft) return null;
  return page.sections as Section[];
}

export default async function DynamicPage({ params }: { params: { slug?: string[] } }) {
  // @ts-ignore -- headers available in server component
  const host = headers().get('host') as string;
  const slugPath = params.slug || [];
  const sections = await getPageData(host, slugPath);
  if (!sections) notFound();

  return <Sections sections={sections} />;
} 