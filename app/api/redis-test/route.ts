import redis from '@/lib/redis'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('Testing Redis connection with URL:', process.env.KV_REST_API_URL)
    
    // Test Redis connection with ping
    const pingResult = await redis.ping()
    console.log('Redis ping result:', pingResult)
    
    // Test basic Redis operations
    const testKey = 'test_' + Date.now()
    await redis.set(testKey, 'Connection successful')
    const value = await redis.get(testKey)
    console.log('Redis get result:', value)
    
    // Clean up test key
    await redis.del(testKey)
    
    return NextResponse.json({
      status: 'success',
      message: 'Redis connection and operations successful',
      data: {
        testValue: value,
        pingResponse: pingResult,
        environmentVariables: {
          hasUrl: !!process.env.KV_REST_API_URL,
          hasToken: !!process.env.KV_REST_API_TOKEN
        }
      }
    })
  } catch (error: any) {
    console.error('Redis test error:', error)
    return NextResponse.json({
      status: 'error',
      message: 'Redis connection failed',
      error: error.message,
      details: {
        environmentVariables: {
          hasUrl: !!process.env.KV_REST_API_URL,
          hasToken: !!process.env.KV_REST_API_TOKEN
        }
      }
    }, { status: 500 })
  }
}
