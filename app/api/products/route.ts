import { getTenantByDomain, getTenantProducts } from '@/lib/supabase';
import { cacheKeys, cacheTTL, getOrSetCache, ratelimit } from '@/lib/upstash';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.ip ?? '127.0.0.1';
    // Apply rate limiting
    const { success, limit: rateLimitMax, reset, remaining } = await ratelimit.limit(ip);

    if (!success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimitMax.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': new Date(reset).toISOString()
          }
        }
      );
    }

    // Get tenant from host header
    const host = request.headers.get('host') || '';
    const subdomain = host.split('.')[0];

    // Get tenant information (could be cached as well)
    const tenant = await getTenantByDomain(subdomain);

    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category') || undefined;
    const collection = searchParams.get('collection') || undefined;
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Generate cache key
    const cacheKey = category
      ? cacheKeys.productList(tenant.id, category)
      : cacheKeys.productList(tenant.id);

    // Get products with caching
    const products = await getOrSetCache(
      cacheKey,
      async () => {
        return getTenantProducts(tenant.id, {
          category,
          collection,
          limit,
          offset
        });
      },
      cacheTTL.productList
    );

    // Return response with rate limit headers
    return NextResponse.json(
      {
        products,
        tenant: {
          id: tenant.id,
          name: tenant.name
        },
        pagination: {
          limit,
          offset,
          total: products.length
        }
      },
      {
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': new Date(reset).toISOString(),
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
        }
      }
    );
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
