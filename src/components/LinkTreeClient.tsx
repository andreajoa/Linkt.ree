'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Settings, 
  Palette, 
  Eye, 
  ExternalLink, 
  Instagram, 
  Twitter, 
  Github, 
  Linkedin,
  Youtube,
  Moon,
  Sun
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'

// Tipos para os props
type User = {
  id: string
  username: string
  name: string
  bio: string
  avatar: string
  background: string
  template: string
  theme: string
}

type LinkItem = {
  id: string
  title: string
  url: string
  description?: string
  icon?: string
  clicks: number
}

type SocialItem = {
  id: string
  platform: string
  url: string
  username?: string
}

interface LinkTreeClientProps {
  user: User
  links: LinkItem[]
  socials?: SocialItem[]
}

// Mapeamento de ícones
const iconMap: Record<string, React.ReactNode> = {
  ExternalLink: <ExternalLink className="w-5 h-5" />,
  Instagram: <Instagram className="w-5 h-5" />,
  Twitter: <Twitter className="w-5 h-5" />,
  Github: <Github className="w-5 h-5" />,
  Linkedin: <Linkedin className="w-5 h-5" />,
  Youtube: <Youtube className="w-5 h-5" />
}

export function LinkTreeClient({ user, links, socials = [] }: LinkTreeClientProps) {
  const [theme, setTheme] = useState(user.theme)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simula carregamento de dados
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)
    
    return () => clearTimeout(timer)
  }, [])

  // Função para registrar cliques
  const handleLinkClick = async (linkId: string) => {
    try {
      // Em produção, isso seria uma chamada API para registrar o clique
      console.log(`Link clicked: ${linkId}`)
    } catch (error) {
      console.error('Error registering click:', error)
    }
  }

  // Alternar tema
  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  // Classes condicionais baseadas no tema e template
  const containerClasses = cn(
    'min-h-screen w-full transition-colors duration-300',
    {
      'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500': user.background === 'gradient-cosmic',
      'bg-gray-950 text-white': theme === 'dark',
      'bg-gray-100 text-gray-900': theme === 'light'
    }
  )

  const cardClasses = cn(
    'max-w-md mx-auto p-6 rounded-xl shadow-xl',
    {
      'bg-white/10 backdrop-blur-lg border border-white/20': user.template === 'glassmorphism' && theme === 'dark',
      'bg-black/5 backdrop-blur-lg border border-black/10': user.template === 'glassmorphism' && theme === 'light',
      'bg-gray-900': user.template === 'default' && theme === 'dark',
      'bg-white': user.template === 'default' && theme === 'light'
    }
  )

  return (
    <div className={containerClasses}>
      <div className="container mx-auto py-10 px-4">
        {/* Admin Controls - Visível apenas para o dono do perfil */}
        <div className="flex justify-end gap-2 mb-6">
          <Link href="/admin/links" className="p-2 rounded-full bg-black/20 hover:bg-black/30 text-white transition-colors">
            <Plus className="w-5 h-5" />
          </Link>
          <Link href="/admin/design" className="p-2 rounded-full bg-black/20 hover:bg-black/30 text-white transition-colors">
            <Palette className="w-5 h-5" />
          </Link>
          <Link href="/admin/settings" className="p-2 rounded-full bg-black/20 hover:bg-black/30 text-white transition-colors">
            <Settings className="w-5 h-5" />
          </Link>
          <button 
            onClick={toggleTheme} 
            className="p-2 rounded-full bg-black/20 hover:bg-black/30 text-white transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        <AnimatePresence>
          {!isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={cardClasses}
            >
              {/* Perfil */}
              <div className="flex flex-col items-center mb-8">
                <div className="relative w-24 h-24 mb-4">
                  {user.avatar ? (
                    <Image
                      src={user.avatar}
                      alt={user.name || user.username}
                      fill
                      className="rounded-full object-cover border-4 border-white/30"
                      sizes="(max-width: 768px) 100px, 150px"
                      priority
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-gray-500">
                      {user.name?.charAt(0) || user.username.charAt(0)}
                    </div>
                  )}
                </div>
                <h1 className="text-2xl font-bold mb-1">{user.name}</h1>
                <p className="text-sm opacity-80 mb-2">@{user.username}</p>
                {user.bio && <p className="text-center text-sm opacity-70">{user.bio}</p>}
              </div>

              {/* Links */}
              <div className="space-y-3 mb-8">
                {links.map((link) => (
                  <motion.a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleLinkClick(link.id)}
                    className={cn(
                      'flex items-center p-3 rounded-lg transition-all duration-300 w-full',
                      {
                        'bg-white/10 hover:bg-white/20 text-white': theme === 'dark',
                        'bg-black/5 hover:bg-black/10 text-gray-800': theme === 'light'
                      }
                    )}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="mr-3">
                      {link.icon && iconMap[link.icon] ? iconMap[link.icon] : <ExternalLink className="w-5 h-5" />}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{link.title}</h3>
                      {link.description && <p className="text-xs opacity-70">{link.description}</p>}
                    </div>
                  </motion.a>
                ))}
              </div>

              {/* Social Icons */}
              {socials.length > 0 && (
                <div className="flex justify-center gap-4 mt-6">
                  {socials.map((social) => (
                    <motion.a
                      key={social.id}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        'p-2 rounded-full transition-colors',
                        {
                          'bg-white/10 hover:bg-white/20 text-white': theme === 'dark',
                          'bg-black/5 hover:bg-black/10 text-gray-800': theme === 'light'
                        }
                      )}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {social.platform && iconMap[social.platform] ? 
                        iconMap[social.platform] : 
                        <ExternalLink className="w-5 h-5" />
                      }
                    </motion.a>
                  ))}
                </div>
              )}

              {/* Footer */}
              <div className="mt-10 pt-4 border-t border-white/10 text-center">
                <p className="text-xs opacity-50">
                  Criado com <span className="text-pink-500">♥</span> usando Meu-Linktree
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}