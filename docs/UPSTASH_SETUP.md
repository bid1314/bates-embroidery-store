# Upstash Redis Setup Guide

This guide will help you set up Upstash Redis for your multi-tenant ecommerce application.

## Setting up Upstash Redis

### 1. Create an Upstash Account

1. Go to [Upstash Console](https://console.upstash.com/)
2. Sign up for a free account

### 2. Create a Redis Database

1. Click on "Create Database"
2. Configure your database:
   - **Database Name**: Choose a descriptive name (e.g., "bates-embroidery-cache")
   - **Type**: Select "Global" for low latency from all regions
   - **Region**: Choose your primary region (or use Global for multi-region)
   - **Eviction**: Enable if you want automatic cleanup of old data

### 3. Get Your Credentials

After creating the database:

1. Go to the "Details" tab
2. Find the "REST API" section
3. Copy the following values:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

### 4. Configure Environment Variables

Create a `.env.local` file in your project root and add:

```env
# Upstash Redis Configuration
UPSTASH_REDIS_REST_URL=https://your-database-name.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token-here
```

## Features Implemented

### 1. Multi-Tenant Caching

The caching system is designed with multi-tenancy in mind:

- **Isolated Cache Keys**: Each tenant's data is isolated using prefixed keys
- **Tenant-Specific TTLs**: Different cache durations for different data types
- **Easy Invalidation**: Clear all cache for a specific tenant

### 2. Rate Limiting

Protect your API endpoints from abuse:

- **Per-IP Rate Limiting**: 10 requests per 10 seconds by default
- **Customizable Limits**: Easy to adjust for different endpoints
- **Headers**: Rate limit information in response headers

### 3. Cache Key Structure

```
tenant:{tenantId}:product:{productId}
tenant:{tenantId}:products:all
tenant:{tenantId}:products:{category}
tenant:{tenantId}:cart:{sessionId}
tenant:{tenantId}:collection:{collectionId}
tenant:{tenantId}:search:{query}
tenant:{tenantId}:settings
tenant:{tenantId}:theme
```

### 4. Usage Examples

#### Caching Products

```typescript
import { getOrSetCache, cacheKeys, cacheTTL } from '@/lib/upstash';

const products = await getOrSetCache(
  cacheKeys.productList(tenantId, category),
  async () => {
    // Fetch from database
    return await fetchProductsFromDB(tenantId, category);
  },
  cacheTTL.productList // 30 minutes
);
```

#### Invalidating Cache

```typescript
import { invalidateTenantCache, invalidateCache } from '@/lib/upstash';

// Clear all cache for a tenant
await invalidateTenantCache(tenantId);

// Clear specific pattern
await invalidateCache(`tenant:${tenantId}:products:*`);
```

#### Rate Limiting API Routes

```typescript
import { ratelimit } from '@/lib/upstash';

const { success, limit, reset, remaining } = await ratelimit.limit(ip);

if (!success) {
  return new Response('Too many requests', { 
    status: 429,
    headers: {
      'X-RateLimit-Limit': limit.toString(),
      'X-RateLimit-Remaining': remaining.toString(),
      'X-RateLimit-Reset': new Date(reset).toISOString(),
    }
  });
}
```

## Best Practices

1. **Cache Wisely**: Not everything needs to be cached
2. **Set Appropriate TTLs**: Balance between performance and data freshness
3. **Handle Cache Misses**: Always have a fallback to fetch from the database
4. **Monitor Usage**: Keep an eye on your Upstash dashboard for usage patterns
5. **Use Global Databases**: For multi-region deployments, use Upstash Global

## Monitoring

Upstash provides built-in monitoring:

1. Go to your database dashboard
2. Check the "Analytics" tab for:
   - Request counts
   - Bandwidth usage
   - Command statistics
   - Latency metrics

## Troubleshooting

### Connection Issues

1. Verify your environment variables are set correctly
2. Check if your IP is whitelisted (if using IP restrictions)
3. Ensure your tokens have the correct permissions

### Performance Issues

1. Use the Global database type for better latency
2. Implement connection pooling for high-traffic applications
3. Consider using Upstash Edge caching for static content

## Additional Resources

- [Upstash Documentation](https://docs.upstash.com/)
- [Upstash Redis SDK](https://github.com/upstash/upstash-redis)
- [Rate Limiting Guide](https://docs.upstash.com/redis/sdks/ratelimit) 