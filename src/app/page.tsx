import { Suspense } from 'react'
import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { TemplateRenderer } from '@/components/templates/TemplateRenderer'
import { prisma } from '@/lib/prisma'
import { cache } from '@/lib/cache'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  ArrowRight, 
  Star, 
  Users, 
  Zap, 
  Palette, 
  BarChart3,
  Globe,
  Smartphone,
  Shield,
  Rocket
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'LinkTree Pro - Sua presença digital em um só lugar',
  description: 'Crie links incríveis, compartilhe seu conteúdo e conecte-se com seu público. Templates elegantes, analytics avançados e muito mais.',
  keywords: 'linktree, links, bio, social media, portfolio, landing page',
  openGraph: {
    title: 'LinkTree Pro - Sua presença digital em um só lugar',
    description: 'Crie links incríveis, compartilhe seu conteúdo e conecte-se com seu público.',
    type: 'website',
    locale: 'pt_BR',
  },
}

// Componente para usuários não autenticados
function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="relative z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">LinkTree Pro</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-gray-300 hover:text-white transition-colors">
              Recursos
            </Link>
            <Link href="#templates" className="text-gray-300 hover:text-white transition-colors">
              Templates
            </Link>
            <Link href="#pricing" className="text-gray-300 hover:text-white transition-colors">
              Preços
            </Link>
            <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <Link href="/api/auth/signin">Entrar</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm mb-8">
            <Star className="w-4 h-4 mr-2 text-yellow-400" />
            <span>+10.000 criadores já usam o LinkTree Pro</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Sua presença digital
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              em um só lugar
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Crie links incríveis, compartilhe seu conteúdo e conecte-se com seu público. 
            Templates elegantes, analytics avançados e muito mais.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 text-lg">
              <Link href="/api/auth/signin">
                Começar Grátis
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 py-4 text-lg">
              <Link href="#demo">
                Ver Demo
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Recursos que fazem a diferença
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Tudo que você precisa para criar uma presença digital profissional
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Palette,
                title: "Templates Elegantes",
                description: "Mais de 50 templates modernos e responsivos para todos os estilos"
              },
              {
                icon: BarChart3,
                title: "Analytics Avançados",
                description: "Acompanhe cliques, visualizações e engajamento em tempo real"
              },
              {
                icon: Zap,
                title: "Performance Otimizada",
                description: "Carregamento ultra-rápido com tecnologia de ponta"
              },
              {
                icon: Globe,
                title: "Domínio Personalizado",
                description: "Use seu próprio domínio para uma presença profissional"
              },
              {
                icon: Smartphone,
                title: "100% Responsivo",
                description: "Perfeito em qualquer dispositivo, do mobile ao desktop"
              },
              {
                icon: Shield,
                title: "Seguro e Confiável",
                description: "Proteção de dados e backup automático garantidos"
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300">
                <feature.icon className="w-12 h-12 text-purple-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Preview */}
      <section id="templates" className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Templates que impressionam
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Escolha entre nossos templates profissionais ou crie o seu próprio
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Glassmorphism",
                description: "Design moderno com efeitos de vidro",
                gradient: "from-blue-500/20 to-purple-500/20",
                border: "border-blue-400/30"
              },
              {
                name: "Neumorphism",
                description: "Estilo minimalista com profundidade",
                gradient: "from-gray-500/20 to-gray-600/20",
                border: "border-gray-400/30"
              },
              {
                name: "Cyberpunk",
                description: "Visual futurista e vibrante",
                gradient: "from-pink-500/20 to-cyan-500/20",
                border: "border-pink-400/30"
              },
              {
                name: "Minimalist",
                description: "Simplicidade e elegância",
                gradient: "from-white/10 to-gray-500/20",
                border: "border-white/30"
              },
              {
                name: "Business",
                description: "Profissional e confiável",
                gradient: "from-indigo-500/20 to-blue-500/20",
                border: "border-indigo-400/30"
              },
              {
                name: "Creative",
                description: "Artístico e expressivo",
                gradient: "from-orange-500/20 to-red-500/20",
                border: "border-orange-400/30"
              }
            ].map((template, index) => (
              <div key={index} className={`bg-gradient-to-br ${template.gradient} backdrop-blur-sm rounded-2xl p-6 border ${template.border} hover:scale-105 transition-all duration-300 cursor-pointer`}>
                <div className="h-32 bg-white/10 rounded-xl mb-4 flex items-center justify-center">
                  <span className="text-white/50 text-sm">Preview</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {template.name}
                </h3>
                <p className="text-gray-300 text-sm">
                  {template.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-3xl p-12 border border-white/10">
            <h2 className="text-4xl font-bold text-white mb-6">
              Pronto para começar?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Junte-se a milhares de criadores que já usam o LinkTree Pro
            </p>
            <Button asChild size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-12 py-4 text-xl">
              <Link href="/api/auth/signin">
                Criar Minha Página Grátis
                <Rocket className="ml-2 w-6 h-6" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
              <Rocket className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-semibold text-white">LinkTree Pro</span>
          </div>
          <p className="text-gray-400">
            Criado com ❤️ para conectar o mundo digital
          </p>
        </div>
      </footer>
    </div>
  )
}

// Componente para usuários autenticados
async function UserPage() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return <LandingPage />
    }

    // Buscar dados do usuário com cache
    const cacheKey = `user:${session.user.id}`
    let user = await cache.get(cacheKey)
    
    if (!user) {
      user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
          links: true,
          socials: true,
          pages: true,
        },
      })
      
      if (user) {
        await cache.set(cacheKey, user, 300) // Cache por 5 minutos
      }
    }

    if (!user) {
      return <LandingPage />
    }

    // Se o usuário tem uma página, mostrar ela
    if (user.pages && user.pages.length > 0) {
      const page = user.pages[0]
      return (
        <Suspense fallback={<div>Carregando...</div>}>
          <TemplateRenderer 
            user={user} 
            onLinkClick={async (linkId: string) => {
              // Implementar tracking de cliques
              console.log('Link clicked:', linkId)
            }}
          />
        </Suspense>
      )
    }

    // Se não tem página, redirecionar para criação
    redirect('/admin')
  } catch (error) {
    console.error('Error in UserPage:', error)
    return <LandingPage />
  }
}

export default function HomePage() {
  return <UserPage />
}