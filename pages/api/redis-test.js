import redis from '../../lib/redis'

export default async function handler(req, res) {
  try {
    // Test basic Redis operations
    await redis.set('test', 'Connection successful')
    const value = await redis.get('test')
    
    res.status(200).json({ 
      status: 'success',
      message: 'Redis connection test',
      data: {
        testValue: value,
        pingResponse: await redis.ping()
      }
    })
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Redis connection failed',
      error: error.message
    })
  }
}
