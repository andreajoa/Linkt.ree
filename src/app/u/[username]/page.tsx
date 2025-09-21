import { Suspense } from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { TemplateRenderer } from '@/components/templates/TemplateRenderer'
import { prisma } from '@/lib/prisma'
import { CacheManager } from '@/lib/cache'
import { LinkTreeAnalytics } from '@/lib/analytics'

interface PageProps {
  params: {
    username: string
  }
}

async function getUserByUsername(username: string) {
  // Tentar buscar no cache primeiro
  let user = await CacheManager.getCachedPublicProfile(username)
  
  if (!user) {
    user = await prisma.user.findUnique({
      where: { username },
      include: {
        links: {
          where: { isActive: true },
          orderBy: { order: 'asc' }
        },
        socials: {
          where: { isActive: true }
        }
      }
    })

    if (user) {
      // Cache por 30 minutos para perfis públicos
      await CacheManager.cachePublicProfile(username, user, 1800)
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
  const imageUrl = user.image || user.avatar || `${process.env.NEXTAUTH_URL}/api/og?username=${user.username}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'profile',
      url: `${process.env.NEXTAUTH_URL}/${user.username}`,
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
      canonical: `${process.env.NEXTAUTH_URL}/${user.username}`,
    },
  }
}

async function handleLinkClick(linkId: string, metadata: any) {
  'use server'
  
  try {
    const link = await prisma.link.findUnique({
      where: { id: linkId },
      include: { user: true }
    })

    if (!link) return

    // Rastrear o clique
    await LinkTreeAnalytics.trackLinkClick(linkId, link.userId, metadata)

    // Invalidar cache do usuário
    await CacheManager.invalidateUserCache(link.userId)
    if (link.user.username) {
      await CacheManager.invalidateProfileCache(link.user.username)
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
          onLinkClick={(linkId) => {
            // Cliente-side tracking via API
            fetch('/api/track/click', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ linkId }),
            }).catch(console.error)
          }}
        />
      </Suspense>
    </main>
  )
}

// Generate static params for popular users (ISR)
export async function generateStaticParams() {
  const popularUsers = await prisma.user.findMany({
    where: {
      username: {
        not: null
      },
      links: {
        some: {
          clicks: {
            gt: 100 // Usuários com pelo menos 100 cliques
          }
        }
      }
    },
    select: {
      username: true
    },
    take: 100 // Gerar estático para os 100 usuários mais populares
  })

  return popularUsers.map((user) => ({
    username: user.username!,
  }))
}

// Revalidate every hour
export const revalidate = 3600

