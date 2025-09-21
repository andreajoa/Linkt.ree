import { PrismaClient } from '@prisma/client'

declare global {
  // eslint-disable-next-line no-var
  var cachedPrisma: PrismaClient | undefined
}

// Só inicializar Prisma se DATABASE_URL existir
let prisma: PrismaClient | null = null

try {
  if (process.env.DATABASE_URL) {
    if (process.env.NODE_ENV === 'production') {
      prisma = new PrismaClient()
    } else {
      if (!global.cachedPrisma) {
        global.cachedPrisma = new PrismaClient()
      }
      prisma = global.cachedPrisma
    }
  } else {
    console.warn('DATABASE_URL not configured - Prisma disabled')
  }
} catch (error) {
  console.warn('Prisma initialization failed:', error)
  prisma = null
}

// Helper function para usar o Prisma com segurança
function ensurePrisma(): PrismaClient {
  if (!prisma) {
    throw new Error('Database not configured. Please set DATABASE_URL environment variable.')
  }
  return prisma
}

// Export both for compatibility
export { prisma, ensurePrisma }