import { Redis } from '@upstash/redis'

// Configuração do Redis para cache - só inicializar se as env vars existirem
const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN 
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

// Helper function to ensure Redis is available
function ensureRedis() {
  if (!redis || !process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    console.warn('Redis not configured, using fallback cache');
    return null;
  }
  return redis;
}

export class CacheManager {
  // Cache de usuário
  static async cacheUser(userId: string, userData: any, ttl = 3600) {
    try {
      const client = ensureRedis();
      if (!client) return; // Gracefully handle missing Redis
      
      await client.setex(`user:${userId}`, ttl, JSON.stringify(userData))
    } catch (error) {
      console.error('Cache error:', error)
    }
  }

  static async getCachedUser(userId: string) {
    try {
      const client = ensureRedis();
      if (!client) return null;
      
      const cached = await client.get(`user:${userId}`)
      return cached ? JSON.parse(cached as string) : null
    } catch (error) {
      console.error('Cache retrieval error:', error)
      return null
    }
  }

  // Cache de links
  static async cacheUserLinks(userId: string, links: any[], ttl = 1800) {
    try {
      const client = ensureRedis();
      if (!client) return;
      
      await client.setex(`links:${userId}`, ttl, JSON.stringify(links))
    } catch (error) {
      console.error('Cache error:', error)
    }
  }

  static async getCachedUserLinks(userId: string) {
    try {
      const client = ensureRedis();
      if (!client) return null;
      
      const cached = await client.get(`links:${userId}`)
      return cached ? JSON.parse(cached as string) : null
    } catch (error) {
      console.error('Cache retrieval error:', error)
      return null
    }
  }

  // Cache de perfil público
  static async cachePublicProfile(username: string, profileData: any, ttl = 1800) {
    try {
      const client = ensureRedis();
      if (!client) return;
      
      await client.setex(`profile:${username}`, ttl, JSON.stringify(profileData))
    } catch (error) {
      console.error('Cache error:', error)
    }
  }

  static async getCachedPublicProfile(username: string) {
    try {
      const client = ensureRedis();
      if (!client) return null;
      
      const cached = await client.get(`profile:${username}`)
      return cached ? JSON.parse(cached as string) : null
    } catch (error) {
      console.error('Cache retrieval error:', error)
      return null
    }
  }

  // Invalidar cache
  static async invalidateUserCache(userId: string) {
    try {
      const client = ensureRedis();
      if (!client) return;
      
      const pipeline = client.pipeline()
      pipeline.del(`user:${userId}`)
      pipeline.del(`links:${userId}`)
      await pipeline.exec()
    } catch (error) {
      console.error('Cache invalidation error:', error)
    }
  }

  static async invalidateProfileCache(username: string) {
    try {
      const client = ensureRedis();
      if (!client) return;
      
      await client.del(`profile:${username}`)
    } catch (error) {
      console.error('Cache invalidation error:', error)
    }
  }

  // Rate limiting
  static async checkRateLimit(key: string, limit = 100, window = 60) {
    try {
      const client = ensureRedis();
      if (!client) return true; // Allow if Redis not available
      
      const current = await client.incr(key)
      if (current === 1) {
        await client.expire(key, window)
      }
      return current <= limit
    } catch (error) {
      console.error('Rate limit error:', error)
      return true // Permitir em caso de erro
    }
  }
}

// Export both the class and a default cache instance
export { redis }
export const cache = CacheManager; // Add this export for compatibility


