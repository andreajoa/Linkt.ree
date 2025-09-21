import { Redis } from '@upstash/redis'

// Configuração do Redis para cache
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export class CacheManager {
  // Cache de usuário
  static async cacheUser(userId: string, userData: any, ttl = 3600) {
    try {
      await redis.setex(`user:${userId}`, ttl, JSON.stringify(userData))
    } catch (error) {
      console.error('Cache error:', error)
    }
  }

  static async getCachedUser(userId: string) {
    try {
      const cached = await redis.get(`user:${userId}`)
      return cached ? JSON.parse(cached as string) : null
    } catch (error) {
      console.error('Cache retrieval error:', error)
      return null
    }
  }

  // Cache de links
  static async cacheUserLinks(userId: string, links: any[], ttl = 1800) {
    try {
      await redis.setex(`links:${userId}`, ttl, JSON.stringify(links))
    } catch (error) {
      console.error('Cache error:', error)
    }
  }

  static async getCachedUserLinks(userId: string) {
    try {
      const cached = await redis.get(`links:${userId}`)
      return cached ? JSON.parse(cached as string) : null
    } catch (error) {
      console.error('Cache retrieval error:', error)
      return null
    }
  }

  // Cache de perfil público
  static async cachePublicProfile(username: string, profileData: any, ttl = 1800) {
    try {
      await redis.setex(`profile:${username}`, ttl, JSON.stringify(profileData))
    } catch (error) {
      console.error('Cache error:', error)
    }
  }

  static async getCachedPublicProfile(username: string) {
    try {
      const cached = await redis.get(`profile:${username}`)
      return cached ? JSON.parse(cached as string) : null
    } catch (error) {
      console.error('Cache retrieval error:', error)
      return null
    }
  }

  // Invalidar cache
  static async invalidateUserCache(userId: string) {
    try {
      const pipeline = redis.pipeline()
      pipeline.del(`user:${userId}`)
      pipeline.del(`links:${userId}`)
      await pipeline.exec()
    } catch (error) {
      console.error('Cache invalidation error:', error)
    }
  }

  static async invalidateProfileCache(username: string) {
    try {
      await redis.del(`profile:${username}`)
    } catch (error) {
      console.error('Cache invalidation error:', error)
    }
  }

  // Rate limiting
  static async checkRateLimit(key: string, limit = 100, window = 60) {
    try {
      const current = await redis.incr(key)
      if (current === 1) {
        await redis.expire(key, window)
      }
      return current <= limit
    } catch (error) {
      console.error('Rate limit error:', error)
      return true // Permitir em caso de erro
    }
  }
}

export { redis }
