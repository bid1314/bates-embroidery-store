import { Redis } from '@upstash/redis'

// Use Redis.fromEnv() for automatic environment variable detection
// or fallback to manual configuration
const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : Redis.fromEnv()

export default redis
