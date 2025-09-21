import { Suspense } from 'react'
import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { TemplateRenderer } from '@/components/templates/TemplateRenderer'
import { prisma } from '@/lib/prisma'
import { cache } from '@/lib/cache'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'LinkTree Pro - Compartilhe todos os seus links',
  description: 'Plataforma moderna e escalável para compartilhar todos os seus links em um só lugar',
  openGraph: {
    title: 'LinkTree Pro - Compartilhe todos os seus links',
    description: 'Plataforma moderna e escalável para compartilhar todos os seus links em um só lugar',
    type: 'website',
  },
}

async function getUserData() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    // Se não autenticado, mostrar demo
    return {
      id: 'demo',
      username: 'demo-user',
      name: 'LinkTree Pro Demo',
      email: null,
      bio: 'Criador de conteúdo • Designer • Desenvolvedor\n✨ Esta é uma demonstração do LinkTree Pro',
      image: null,
      avatar: null,
      background: 'gradient-cosmic',
      template: 'glassmorphism',
      theme: 'dark',
      isPremium: true,
      plan: 'demo',
      createdAt: new Date(),
      updatedAt: new Date(),
      emailVerified: null,
      links: [
        {
          id: 'demo-1',
          title: '🚀 Meu Portfolio',
          url: 'https://portfolio-demo.com',
          description: 'Veja todos os meus projetos incríveis',
          icon: 'ExternalLink',
          image: null,
          isActive: true,
          order: 0,
          clicks: 1234,
          userId: 'demo',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'demo-2',
          title: '📺 YouTube Channel',
          url: 'https://youtube.com/@demo',
          description: 'Tutoriais e conteúdo tech exclusivo',
          icon: 'Youtube',
          image: null,
          isActive: true,
          order: 1,
          clicks: 890,
          userId: 'demo',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'demo-3',
          title: '📚 Curso de Next.js Pro',
          url: 'https://curso-nextjs.dev',
          description: 'Aprenda a criar aplicações modernas e escaláveis',
          icon: 'ExternalLink',
          image: null,
          isActive: true,
          order: 2,
          clicks: 567,
          userId: 'demo',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'demo-4',
          title: '💼 LinkedIn',
          url: 'https://linkedin.com/in/demo',
          description: 'Conecte-se comigo profissionalmente',
          icon: 'Linkedin',
          image: null,
          isActive: true,
          order: 3,
          clicks: 234,
          userId: 'demo',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      socials: [
        {
          id: 'social-1',
          platform: 'instagram',
          url: 'https://instagram.com/linktreepro',
          username: 'linktreepro',
          isActive: true,
          userId: 'demo'
        },
        {
          id: 'social-2',
          platform: 'twitter',
          url: 'https://twitter.com/linktreepro',
          username: 'linktreepro',
          isActive: true,
          userId: 'demo'
        },
        {
          id: 'social-3',
          platform: 'github',
          url: 'https://github.com/linktreepro',
          username: 'linktreepro',
          isActive: true,
          userId: 'demo'
        }
      ]
    }
  }

  // Tentar buscar no cache primeiro
  let user = await CacheManager.getCachedUser(session.user.id)
  
  if (!user) {
    user = await prisma.user.findUnique({
      where: { id: session.user.id },
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
      await CacheManager.cacheUser(session.user.id, user)
    }
  }

  if (!user) {
    redirect('/auth/setup')
  }

  return user
}

async function handleLinkClick(linkId: string) {
  'use server'
  
  try {
    // Esta função será chamada via API route
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/track/click`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ linkId }),
    })

    if (!response.ok) {
      console.error('Failed to track click')
    }
  } catch (error) {
    console.error('Error tracking click:', error)
  }
}

export default async function Home() {
  const userData = await getUserData()

  return (
    <main>
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-xl">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white text-center">Carregando seu LinkTree...</p>
          </div>
        </div>
      }>
        <TemplateRenderer 
          user={userData}
          onLinkClick={handleLinkClick}
        />
      </Suspense>
    </main>
  )
}
