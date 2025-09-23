import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function createSampleUser() {
  try {
    // Verificar se já existe um usuário de exemplo
    const existingUser = await prisma.user.findFirst({
      where: { email: 'demo@linktreepro.com' }
    })

    if (existingUser) {
      return existingUser
    }

    // Criar usuário de exemplo
    const user = await prisma.user.create({
      data: {
        email: 'demo@linktreepro.com',
        name: 'João Silva',
        username: 'joaosilva',
        bio: 'Criador de conteúdo digital e entusiasta de tecnologia',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        template: 'glassmorphism',
        isPremium: true,
        plan: 'pro'
      }
    })

    // Criar página de exemplo
    const page = await prisma.page.create({
      data: {
        userId: user.id,
        slug: user.username || 'demo',
        title: `${user.name}'s Links`,
        description: 'Conecte-se comigo através dos links abaixo',
        isPublic: true
      }
    })

    // Criar blocks de exemplo
    const blocks = [
      {
        pageId: page.id,
        type: 'link',
        position: 1,
        title: 'Meu Portfólio',
        data: JSON.stringify({
          url: 'https://joaosilva.dev',
          description: 'Conheça meus projetos e trabalhos',
          icon: 'ExternalLink'
        }),
        isActive: true
      },
      {
        pageId: page.id,
        type: 'link',
        position: 2,
        title: 'Curso de React',
        data: JSON.stringify({
          url: 'https://curso-react.com',
          description: 'Aprenda React do zero ao avançado',
          icon: 'ExternalLink'
        }),
        isActive: true
      },
      {
        pageId: page.id,
        type: 'link',
        position: 3,
        title: 'Newsletter',
        data: JSON.stringify({
          url: 'https://newsletter.joaosilva.com',
          description: 'Receba dicas semanais de programação',
          icon: 'ExternalLink'
        }),
        isActive: true
      },
      {
        pageId: page.id,
        type: 'social',
        position: 4,
        title: 'Instagram',
        data: JSON.stringify({
          url: 'https://instagram.com/joaosilva',
          platform: 'instagram'
        }),
        isActive: true
      },
      {
        pageId: page.id,
        type: 'social',
        position: 5,
        title: 'Twitter',
        data: JSON.stringify({
          url: 'https://twitter.com/joaosilva',
          platform: 'twitter'
        }),
        isActive: true
      },
      {
        pageId: page.id,
        type: 'social',
        position: 6,
        title: 'GitHub',
        data: JSON.stringify({
          url: 'https://github.com/joaosilva',
          platform: 'github'
        }),
        isActive: true
      },
      {
        pageId: page.id,
        type: 'social',
        position: 7,
        title: 'YouTube',
        data: JSON.stringify({
          url: 'https://youtube.com/@joaosilva',
          platform: 'youtube'
        }),
        isActive: true
      }
    ]

    await prisma.block.createMany({
      data: blocks
    })

    return user
  } catch (error) {
    console.error('Erro ao criar usuário de exemplo:', error)
    throw error
  }
}

export async function getSampleUserWithPages() {
  try {
    const user = await prisma.user.findFirst({
      where: { email: 'demo@linktreepro.com' },
      include: {
        pages: {
          include: {
            blocks: true
          }
        }
      }
    })

    if (!user) {
      return await createSampleUser()
    }

    return user
  } catch (error) {
    console.error('Erro ao buscar usuário de exemplo:', error)
    throw error
  }
}
