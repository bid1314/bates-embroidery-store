import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

// Initialize Redis client
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Rate limiting configuration for API endpoints
export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '10 s'), // 10 requests per 10 seconds
  analytics: true,
  prefix: '@upstash/ratelimit',
});

// Multi-tenant cache key generators
export const cacheKeys = {
  // Product cache keys
  product: (tenantId: string, productId: string) => 
    `tenant:${tenantId}:product:${productId}`,
  productList: (tenantId: string, category?: string) => 
    category ? `tenant:${tenantId}:products:${category}` : `tenant:${tenantId}:products:all`,
  
  // Cart cache keys
  cart: (tenantId: string, sessionId: string) => 
    `tenant:${tenantId}:cart:${sessionId}`,
  
  // Collection cache keys
  collection: (tenantId: string, collectionId: string) => 
    `tenant:${tenantId}:collection:${collectionId}`,
  collections: (tenantId: string) => 
    `tenant:${tenantId}:collections`,
  
  // Search cache keys
  search: (tenantId: string, query: string) => 
    `tenant:${tenantId}:search:${query.toLowerCase().replace(/\s+/g, '-')}`,
  
  // Tenant settings cache keys
  tenantSettings: (tenantId: string) => 
    `tenant:${tenantId}:settings`,
  tenantTheme: (tenantId: string) => 
    `tenant:${tenantId}:theme`,
};

// Cache TTL values (in seconds)
export const cacheTTL = {
  product: 3600, // 1 hour
  productList: 1800, // 30 minutes
  cart: 7200, // 2 hours
  collection: 3600, // 1 hour
  search: 900, // 15 minutes
  tenantSettings: 86400, // 24 hours
  tenantTheme: 86400, // 24 hours
};

// Helper function to get or set cache
export async function getOrSetCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number
): Promise<T> {
  try {
    // Try to get from cache
    const cached = await redis.get<T>(key);
    if (cached) {
      return cached;
    }
    
    // If not in cache, fetch and store
    const data = await fetcher();
    await redis.setex(key, ttl, data);
    return data;
  } catch (error) {
    console.error('Cache error:', error);
    // Fallback to fetcher if cache fails
    return fetcher();
  }
}

// Helper function to invalidate cache patterns
export async function invalidateCache(pattern: string): Promise<void> {
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch (error) {
    console.error('Cache invalidation error:', error);
  }
}

// Helper function to invalidate all tenant cache
export async function invalidateTenantCache(tenantId: string): Promise<void> {
  await invalidateCache(`tenant:${tenantId}:*`);
} 