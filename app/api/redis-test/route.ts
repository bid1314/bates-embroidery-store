import { testConnection } from '@/utils/redis'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const result = await testConnection()
    return NextResponse.json({
      status: 'success',
      message: 'Redis connection established',
      testValue: result
    })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })

  }
}
