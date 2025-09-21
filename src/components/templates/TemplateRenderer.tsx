'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { getTemplate, TemplateConfig } from '@/lib/templates/registry'
import { User, Link as LinkType, Social } from '@prisma/client'
import { 
  ExternalLink, 
  Instagram, 
  Twitter, 
  Github, 
  Linkedin,
  Youtube,
  Facebook,
  Video,
  Twitch,
  MessageCircle
} from 'lucide-react'
import Image from 'next/image'

interface TemplateRendererProps {
  user: User & {
    links: LinkType[]
    socials: Social[]
  }
  onLinkClick?: (linkId: string) => void
}

// Mapeamento de ícones sociais
const socialIcons: Record<string, React.ReactNode> = {
  instagram: <Instagram className="w-5 h-5" />,
  twitter: <Twitter className="w-5 h-5" />,
  github: <Github className="w-5 h-5" />,
  linkedin: <Linkedin className="w-5 h-5" />,
  youtube: <Youtube className="w-5 h-5" />,
  facebook: <Facebook className="w-5 h-5" />,
  tiktok: <Video className="w-5 h-5" />,
  twitch: <Twitch className="w-5 h-5" />,
  discord: <MessageCircle className="w-5 h-5" />,
}

// Mapeamento de ícones para links
const linkIcons: Record<string, React.ReactNode> = {
  ExternalLink: <ExternalLink className="w-5 h-5" />,
  Instagram: <Instagram className="w-5 h-5" />,
  Twitter: <Twitter className="w-5 h-5" />,
  Github: <Github className="w-5 h-5" />,
  Linkedin: <Linkedin className="w-5 h-5" />,
  Youtube: <Youtube className="w-5 h-5" />,
}

export function TemplateRenderer({ user, onLinkClick }: TemplateRendererProps) {
  const template = getTemplate(user.template || 'glassmorphism')
  
  if (!template) {
    return <div>Template não encontrado</div>
  }

  const handleLinkClick = async (link: LinkType) => {
    if (onLinkClick) {
      onLinkClick(link.id)
    }
    // Abrir link em nova aba
    window.open(link.url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className={cn(template.styles.container, "p-4")}>
      <div className="container mx-auto py-10 px-4">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={cn(template.styles.card, "p-8 max-w-md mx-auto")}
          >
            {/* Perfil */}
            <motion.div 
              className={cn(template.styles.profile, "mb-8")}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex flex-col items-center">
                {/* Avatar */}
                <motion.div 
                  className="relative w-24 h-24 mb-4"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  {user.image || user.avatar ? (
                    <Image
                      src={user.image || user.avatar || ''}
                      alt={user.name || user.username || 'User'}
                      fill
                      className="rounded-full object-cover border-4 border-white/30 shadow-lg"
                      sizes="(max-width: 768px) 96px, 96px"
                      priority
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                      {(user.name || user.username || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                </motion.div>

                {/* Nome e Username */}
                <motion.h1 
                  className="text-2xl font-bold mb-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {user.name || user.username}
                </motion.h1>
                
                {user.username && (
                  <motion.p 
                    className="text-sm opacity-80 mb-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    @{user.username}
                  </motion.p>
                )}

                {/* Bio */}
                {user.bio && (
                  <motion.p 
                    className="text-center text-sm opacity-70 max-w-xs"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    {user.bio}
                  </motion.p>
                )}
              </div>
            </motion.div>

            {/* Links */}
            <motion.div 
              className="space-y-4 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {user.links
                .filter(link => link.isActive)
                .sort((a, b) => a.order - b.order)
                .map((link, index) => (
                <motion.button
                  key={link.id}
                  onClick={() => handleLinkClick(link)}
                  className={cn(
                    template.styles.link,
                    "flex items-center p-4 w-full text-left group"
                  )}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    duration: 0.4, 
                    delay: 0.7 + (index * 0.1),
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ 
                    scale: template.customization.animations ? 1.02 : 1,
                    y: template.customization.animations ? -2 : 0
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Ícone */}
                  <div className="mr-4 opacity-80 group-hover:opacity-100 transition-opacity">
                    {link.icon && linkIcons[link.icon] ? 
                      linkIcons[link.icon] : 
                      <ExternalLink className="w-5 h-5" />
                    }
                  </div>

                  {/* Conteúdo */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base truncate group-hover:text-opacity-100">
                      {link.title}
                    </h3>
                    {link.description && (
                      <p className="text-sm opacity-70 truncate mt-1">
                        {link.description}
                      </p>
                    )}
                  </div>

                  {/* Contador de cliques */}
                  <div className="text-xs opacity-50 ml-2">
                    {link.clicks}
                  </div>
                </motion.button>
              ))}
            </motion.div>

            {/* Redes Sociais */}
            {user.socials.length > 0 && (
              <motion.div 
                className="flex justify-center gap-4 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                {user.socials
                  .filter(social => social.isActive)
                  .map((social, index) => (
                  <motion.a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      template.styles.social,
                      "p-3 transition-all duration-300"
                    )}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ 
                      delay: 1.1 + (index * 0.1),
                      type: "spring",
                      stiffness: 200
                    }}
                    whileHover={{ 
                      scale: template.customization.animations ? 1.1 : 1,
                      rotate: template.customization.animations ? 5 : 0
                    }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {socialIcons[social.platform.toLowerCase()] || 
                     <ExternalLink className="w-5 h-5" />}
                  </motion.a>
                ))}
              </motion.div>
            )}

            {/* Footer */}
            <motion.div 
              className="mt-10 pt-6 border-t border-white/10 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              <p className="text-xs opacity-50">
                Criado com <span className="text-pink-500 animate-pulse">♥</span> usando LinkTree Pro
              </p>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default TemplateRenderer
