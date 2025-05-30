import { Redis } from '@upstash/redis'

if (!process.env.UPSTASH_REDIS_REST_URL) {
  throw new Error('UPSTASH_REDIS_REST_URL is not defined in environment variables')
}

if (!process.env.UPSTASH_REDIS_REST_TOKEN) {
  throw new Error('UPSTASH_REDIS_REST_TOKEN is not defined in environment variables')
}

if (!process.env.UPSTASH_REDIS_REST_URL.startsWith('https://')) {
  throw new Error('UPSTASH_REDIS_REST_URL must start with https://')
}

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})


// Test connection
export async function testConnection() {
  try {
    const testKey = `connection_test_${Date.now()}`
    await redis.set(testKey, 'success', { ex: 60 }) // Set with 60s expiration
    const result = await redis.get(testKey)
    await redis.del(testKey) // Clean up test key
    return result
  } catch (error) {
    throw new Error(`Redis connection failed: ${error instanceof Error ? error.message : String(error)}`)
  }
}


export default redis
