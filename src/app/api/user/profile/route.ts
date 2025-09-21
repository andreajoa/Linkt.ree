import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { cache } from '@/lib/cache'
import { z } from 'zod'

const profileUpdateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  bio: z.string().max(500).optional(),
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_-]+$/).optional(),
  template: z.string().optional(),
  theme: z.string().optional(),
  background: z.string().optional(),
})

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Tentar buscar no cache primeiro
    let user = await CacheManager.getCachedUser(session.user.id)
    
    if (!user) {
      user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
          links: {
            orderBy: { order: 'asc' },
            where: { isActive: true }
          },
          socials: {
            where: { isActive: true }
          }
        }
      })

      if (user) {
        await CacheManager.cacheUser(session.user.id, user)
      }
    }

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      user
    })

  } catch (error) {
    console.error('Profile GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = profileUpdateSchema.parse(body)

    // Verificar se username está disponível (se fornecido)
    if (validatedData.username) {
      const existingUser = await prisma.user.findUnique({
        where: { username: validatedData.username }
      })

      if (existingUser && existingUser.id !== session.user.id) {
        return NextResponse.json({ 
          error: 'Username already taken' 
        }, { status: 409 })
      }
    }

    // Atualizar perfil
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: validatedData,
      include: {
        links: {
          orderBy: { order: 'asc' },
          where: { isActive: true }
        },
        socials: {
          where: { isActive: true }
        }
      }
    })

    // Invalidar cache
    await CacheManager.invalidateUserCache(session.user.id)
    if (updatedUser.username) {
      await CacheManager.invalidateProfileCache(updatedUser.username)
    }

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: 'Profile updated successfully'
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Validation error', 
        details: error.errors 
      }, { status: 400 })
    }

    console.error('Profile PUT error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
