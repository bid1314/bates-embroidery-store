import redis from '@/lib/redis'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Test basic Redis operations
    await redis.set('test', 'Connection successful')
    const value = await redis.get('test')
    
    return NextResponse.json({
      status: 'success',
      message: 'Redis connection test',
      data: {
        testValue: value,
        pingResponse: await redis.ping()
      }
    })
  } catch (error: any) {
    console.error('Redis test error:', error)
    return NextResponse.json({
      status: 'error',
      message: 'Redis connection failed',
      error: error.message
    }, { status: 500 })
  }
}
