import { Suspense } from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { TemplateRenderer } from '@/components/templates/TemplateRenderer'
import { prisma, ensurePrisma } from '@/lib/prisma'
import { CacheManager } from '@/lib/cache'
import { LinkTreeAnalytics } from '@/lib/analytics'

interface PageProps {
  params: {
    username: string
  }
}

async function getUserByUsername(username: string) {
  // Verificar se o Prisma está disponível
  if (!prisma) {
    console.warn('Database not available - returning mock user')
    return {
      id: 'demo',
      username: username,
      name: username,
      bio: 'Demo user - Database not configured',
      avatar: null,
      background: 'gradient-cosmic',
      template: 'glassmorphism',
      theme: 'dark',
      links: [],
      socials: []
    }
  }

  // Tentar buscar no cache primeiro
  let user = await CacheManager.getCachedPublicProfile(username)
  
  if (!user) {
    try {
      user = await prisma.user.findUnique({
        where: { username },
        include: {
          pages: {
            where: { 
              isPublic: true,
              slug: username
            },
            include: {
              blocks: {
                where: { isActive: true },
                orderBy: { position: 'asc' }
              }
            }
          }
        }
      })

      if (user) {
        // Cache por 30 minutos para perfis públicos
        await CacheManager.cachePublicProfile(username, user, 1800)
      }
    } catch (error) {
      console.error('Database error:', error)
      return null
    }
  }

  return user
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const user = await getUserByUsername(params.username)
  
  if (!user) {
    return {
      title: 'Usuário não encontrado - LinkTree Pro',
      description: 'Este perfil não existe ou foi removido.',
    }
  }

  const title = `${user.name || user.username} - LinkTree Pro`
  const description = user.bio || `Veja todos os links de ${user.name || user.username} em um só lugar`
  const imageUrl = user.image || user.avatar || `/api/og?username=${user.username}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'profile',
      url: `/${user.username}`,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${user.name || user.username} - LinkTree Pro`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
      creator: user.username ? `@${user.username}` : undefined,
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: `/${user.username}`,
    },
  }
}

async function handleLinkClick(blockId: string, metadata: any) {
  'use server'
  
  try {
    if (!prisma) return
    
    const block = await prisma.block.findUnique({
      where: { id: blockId },
      include: { page: { include: { user: true } } }
    })

    if (!block) return

    // Increment click count
    await prisma.block.update({
      where: { id: blockId },
      data: { clicks: { increment: 1 } }
    })

    // Invalidar cache do usuário
    if (block.page.user.username) {
      await CacheManager.invalidateProfileCache(block.page.user.username)
    }
  } catch (error) {
    console.error('Error tracking click:', error)
  }
}

export default async function UserProfilePage({ params }: PageProps) {
  const user = await getUserByUsername(params.username)

  if (!user) {
    notFound()
  }

  return (
    <main>
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-xl">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white text-center">Carregando perfil...</p>
          </div>
        </div>
      }>
        <TemplateRenderer 
          user={user}
          onLinkClick={(blockId) => {
            // Cliente-side tracking via API
            fetch('/api/track/click', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ blockId }),
            }).catch(console.error)
          }}
        />
      </Suspense>
    </main>
  )
}

// REMOVER generateStaticParams por enquanto para não quebrar o build
// Generate static params for popular users (ISR) - DESABILITADO TEMPORARIAMENTE
export async function generateStaticParams() {
  // Retornar array vazio para não quebrar o build quando o banco não está configurado
  try {
    if (!prisma) {
      console.warn('Database not available - skipping static generation')
      return []
    }

    const popularUsers = await prisma.user.findMany({
      where: {
        username: {
          not: null
        }
      },
      select: {
        username: true
      },
      take: 10 // Reduzir para evitar timeouts
    })

    return popularUsers.map((user) => ({
      username: user.username!,
    }))
  } catch (error) {
    console.error('Error in generateStaticParams:', error)
    return []
  }
}

// Revalidate every hour
export const revalidate = 3600
