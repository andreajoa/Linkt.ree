export interface TemplateConfig {
  id: string
  name: string
  category: 'professional' | 'creative' | 'minimal' | 'gaming' | 'business' | 'social'
  description: string
  preview: string
  features: string[]
  customization: {
    colors: 'basic' | 'advanced' | 'full-palette'
    typography: 'basic' | 'google-fonts' | 'custom'
    layout: 'fixed' | 'flexible' | 'grid'
    animations: boolean
  }
  premium: boolean
  styles: TemplateStyles
}

export interface TemplateStyles {
  container: string
  card: string
  link: string
  profile: string
  social: string
  background: string
  animation?: string
}

export const TEMPLATE_REGISTRY: TemplateConfig[] = [
  // ✨ CUTTING-EDGE TEMPLATES ✨

  // Glassmorphism Pro
  {
    id: 'glassmorphism',
    name: 'Glassmorphism Pro',
    category: 'creative',
    description: 'Efeito de vidro ultra-moderno com blur avançado e transparência dinâmica',
    preview: 'bg-gradient-to-br from-purple-400 via-pink-500 to-red-500',
    features: ['advanced-blur-effects', 'dynamic-transparency', 'gradient-mesh', 'micro-animations', 'glass-morphism'],
    customization: {
      colors: 'full-palette',
      typography: 'google-fonts',
      layout: 'flexible',
      animations: true
    },
    premium: false,
    styles: {
      container: 'min-h-screen bg-gradient-mesh animated-mesh from-indigo-500 via-purple-500 to-pink-500',
      card: 'bg-white/[0.08] backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl shadow-purple-500/25 backdrop-saturate-180',
      link: 'bg-white/[0.12] hover:bg-white/[0.18] backdrop-blur-xl border border-white/30 hover:border-white/50 rounded-2xl transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-white/20 group relative overflow-hidden',
      profile: 'text-center text-white drop-shadow-2xl',
      social: 'bg-white/[0.15] hover:bg-white/[0.25] backdrop-blur-xl rounded-full transition-all duration-400 hover:scale-110 hover:rotate-3 shadow-lg hover:shadow-white/30',
      background: 'bg-gradient-mesh animated-mesh from-indigo-500 via-purple-500 to-pink-500',
      animation: 'animate-float-in'
    }
  },

  // Neumorphism Revolution
  {
    id: 'neumorphism',
    name: 'Neumorphism Revolution',
    category: 'creative',
    description: 'Soft UI com sombras internas/externas e efeitos táteis revolucionários',
    preview: 'bg-gradient-to-br from-gray-100 to-gray-300',
    features: ['soft-shadows', 'tactile-feedback', 'depth-illusion', 'smooth-interactions', 'premium-feel'],
    customization: {
      colors: 'advanced',
      typography: 'custom-fonts',
      layout: 'grid',
      animations: true
    },
    premium: true,
    styles: {
      container: 'min-h-screen bg-gradient-to-br from-gray-50 to-gray-200',
      card: 'bg-gray-100 rounded-3xl shadow-neumorphism-inset p-8 border-0',
      link: 'bg-gray-100 hover:bg-gray-50 rounded-2xl shadow-neumorphism hover:shadow-neumorphism-hover transition-all duration-300 active:shadow-neumorphism-pressed transform hover:-translate-y-1 active:translate-y-0',
      profile: 'text-center text-gray-800',
      social: 'bg-gray-100 rounded-full shadow-neumorphism-small hover:shadow-neumorphism-hover transition-all duration-300 hover:scale-105 active:scale-95',
      background: 'bg-gradient-to-br from-gray-50 to-gray-200',
      animation: 'animate-soft-bounce'
    }
  },

  // Cyberpunk Matrix
  {
    id: 'cyberpunk-matrix',
    name: 'Cyberpunk Matrix',
    category: 'gaming',
    description: 'Estilo cyberpunk futurístico com efeitos matrix e neon pulsante',
    preview: 'bg-black border border-cyan-400 shadow-cyan-400/50',
    features: ['matrix-rain', 'neon-glow', 'scan-lines', 'glitch-effects', 'terminal-aesthetic'],
    customization: {
      colors: 'neon-palette',
      typography: 'monospace',
      layout: 'terminal',
      animations: true
    },
    premium: true,
    styles: {
      container: 'min-h-screen bg-black bg-matrix-rain relative overflow-hidden',
      card: 'bg-black/90 backdrop-blur-sm border border-cyan-400/50 rounded-lg shadow-2xl shadow-cyan-400/20 relative before:absolute before:inset-0 before:bg-scan-lines before:opacity-10',
      link: 'bg-gray-900/80 hover:bg-gray-800/90 border border-cyan-400/30 hover:border-cyan-400/80 rounded-lg transition-all duration-300 hover:shadow-cyan-400/50 hover:shadow-lg relative overflow-hidden group before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-cyan-400/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700',
      profile: 'text-center text-cyan-400 font-mono drop-shadow-neon',
      social: 'bg-gray-900/80 hover:bg-gray-800/90 border border-cyan-400/30 hover:border-cyan-400/80 rounded-full transition-all duration-300 hover:shadow-cyan-400/50 hover:scale-110',
      background: 'bg-black bg-matrix-rain',
      animation: 'animate-glitch'
    }
  },

  // Holographic Future
  {
    id: 'holographic',
    name: 'Holographic Future',
    category: 'creative',
    description: 'Interface holográfica com efeitos iridescentes e profundidade 3D',
    preview: 'bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500',
    features: ['holographic-effects', '3d-transforms', 'iridescent-colors', 'depth-layers', 'futuristic-ui'],
    customization: {
      colors: 'holographic',
      typography: 'futuristic',
      layout: 'floating',
      animations: true
    },
    premium: true,
    styles: {
      container: 'min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black relative overflow-hidden',
      card: 'bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl shadow-purple-500/30 relative transform-gpu perspective-1000',
      link: 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 backdrop-blur-sm border border-white/30 rounded-2xl transition-all duration-500 transform-gpu hover:rotateX-2 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/40 relative overflow-hidden group',
      profile: 'text-center text-white drop-shadow-2xl transform-gpu',
      social: 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/40 hover:to-pink-500/40 backdrop-blur-sm rounded-full transition-all duration-500 transform-gpu hover:scale-125 hover:rotateY-12 hover:shadow-lg hover:shadow-purple-500/50',
      background: 'bg-gradient-to-br from-purple-900 via-blue-900 to-black',
      animation: 'animate-holographic'
    }
  },

  // Retro Synthwave
  {
    id: 'retro-synthwave',
    name: 'Retro Synthwave',
    category: 'creative',
    description: 'Estética anos 80 com gradientes neon, grid retrô e efeitos vintage',
    preview: 'bg-gradient-to-b from-purple-900 to-pink-900',
    features: ['synthwave-grid', 'neon-gradients', '80s-aesthetics', 'retro-animations', 'vintage-effects'],
    customization: {
      colors: 'synthwave',
      typography: 'retro-futuristic',
      layout: 'grid-retro',
      animations: true
    },
    premium: true,
    styles: {
      container: 'min-h-screen bg-gradient-to-b from-purple-900 via-pink-900 to-orange-900 bg-synthwave-grid relative overflow-hidden',
      card: 'bg-black/60 backdrop-blur-sm border-2 border-pink-500/50 rounded-lg shadow-2xl shadow-pink-500/30 relative overflow-hidden',
      link: 'bg-gradient-to-r from-purple-900/70 to-pink-900/70 hover:from-purple-800/80 hover:to-pink-800/80 border border-pink-500/40 hover:border-pink-400/70 rounded-lg transition-all duration-400 hover:shadow-pink-500/50 hover:shadow-lg transform hover:scale-105 relative overflow-hidden group',
      profile: 'text-center text-pink-100 drop-shadow-neon font-retro',
      social: 'bg-gradient-to-r from-purple-900/70 to-pink-900/70 hover:from-purple-800/80 hover:to-pink-800/80 border border-pink-500/40 rounded-full transition-all duration-400 hover:scale-110 hover:shadow-pink-500/50',
      background: 'bg-gradient-to-b from-purple-900 via-pink-900 to-orange-900 bg-synthwave-grid',
      animation: 'animate-retro-glow'
    }
  },

  // Liquid Morph
  {
    id: 'liquid-morph',
    name: 'Liquid Morph',
    category: 'creative',
    description: 'Formas fluidas e orgânicas com animações líquidas e morphing',
    preview: 'bg-gradient-to-br from-blue-400 to-purple-600',
    features: ['liquid-animations', 'organic-shapes', 'fluid-morphing', 'blob-effects', 'smooth-transitions'],
    customization: {
      colors: 'fluid-palette',
      typography: 'organic',
      layout: 'flowing',
      animations: true
    },
    premium: true,
    styles: {
      container: 'min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 relative overflow-hidden',
      card: 'bg-white/10 backdrop-blur-2xl rounded-[2rem] shadow-2xl shadow-blue-500/25 border border-white/20 relative overflow-hidden transform-gpu',
      link: 'bg-white/15 hover:bg-white/25 backdrop-blur-xl rounded-[1.5rem] border border-white/30 transition-all duration-700 hover:scale-105 hover:shadow-xl hover:shadow-white/30 relative overflow-hidden group transform-gpu',
      profile: 'text-center text-white drop-shadow-xl',
      social: 'bg-white/20 hover:bg-white/30 backdrop-blur-xl rounded-full transition-all duration-600 hover:scale-125 hover:shadow-lg hover:shadow-white/40 transform-gpu',
      background: 'bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500',
      animation: 'animate-liquid-morph'
    }
  },

  // Minimalist Zen
  {
    id: 'minimalist-zen',
    name: 'Minimalist Zen',
    category: 'minimal',
    description: 'Design ultra-limpo com foco na tipografia e espaçamento perfeito',
    preview: 'bg-white border border-gray-100',
    features: ['perfect-typography', 'golden-ratio', 'minimal-colors', 'zen-spacing', 'clean-aesthetics'],
    customization: {
      colors: 'monochrome',
      typography: 'premium-fonts',
      layout: 'zen-grid',
      animations: false
    },
    premium: false,
    styles: {
      container: 'min-h-screen bg-gradient-to-br from-gray-50 to-white',
      card: 'bg-white/80 backdrop-blur-sm rounded-2xl shadow-zen border border-gray-100/50 p-12',
      link: 'bg-gray-50/50 hover:bg-gray-100/80 rounded-xl border border-gray-200/50 hover:border-gray-300/80 transition-all duration-300 hover:shadow-zen-hover transform hover:-translate-y-0.5',
      profile: 'text-center text-gray-900',
      social: 'bg-gray-50/50 hover:bg-gray-100/80 rounded-full border border-gray-200/50 transition-all duration-300 hover:scale-105',
      background: 'bg-gradient-to-br from-gray-50 to-white',
      animation: 'animate-zen-fade'
    }
  },

  // Business Premium
  {
    id: 'business-premium',
    name: 'Business Premium',
    category: 'business',
    description: 'Template corporativo elegante com elementos profissionais avançados',
    preview: 'bg-slate-800 border border-blue-500',
    features: ['corporate-design', 'professional-layout', 'business-elements', 'trust-indicators', 'conversion-optimized'],
    customization: {
      colors: 'corporate',
      typography: 'business-fonts',
      layout: 'professional-grid',
      animations: true
    },
    premium: true,
    styles: {
      container: 'min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900',
      card: 'bg-slate-800/90 backdrop-blur-sm border border-slate-600/50 rounded-xl shadow-2xl shadow-slate-900/50 relative overflow-hidden',
      link: 'bg-slate-700/60 hover:bg-slate-600/80 border border-slate-600/50 hover:border-blue-500/60 rounded-lg transition-all duration-300 hover:shadow-blue-500/30 hover:shadow-lg transform hover:scale-[1.02]',
      profile: 'text-center text-slate-100',
      social: 'bg-slate-700/60 hover:bg-slate-600/80 border border-slate-600/50 hover:border-blue-500/60 rounded-full transition-all duration-300 hover:scale-105',
      background: 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900',
      animation: 'animate-professional'
    }
  },

  // Creator Studio
  {
    id: 'creator-studio',
    name: 'Creator Studio',
    category: 'social',
    description: 'Otimizado para criadores de conteúdo com elementos de engagement',
    preview: 'bg-gradient-to-br from-pink-400 to-purple-600',
    features: ['creator-optimized', 'engagement-tools', 'social-proof', 'content-showcase', 'fan-interaction'],
    customization: {
      colors: 'creator-palette',
      typography: 'trendy-fonts',
      layout: 'content-focused',
      animations: true
    },
    premium: true,
    styles: {
      container: 'min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 relative overflow-hidden',
      card: 'bg-white/12 backdrop-blur-2xl border border-white/25 rounded-3xl shadow-2xl shadow-pink-500/30 relative overflow-hidden',
      link: 'bg-gradient-to-r from-pink-500/25 to-purple-500/25 hover:from-pink-500/35 hover:to-purple-500/35 backdrop-blur-xl border border-white/30 hover:border-white/50 rounded-2xl transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-pink-500/40',
      profile: 'text-center text-white drop-shadow-2xl',
      social: 'bg-white/20 hover:bg-white/30 backdrop-blur-xl rounded-full transition-all duration-400 hover:scale-125 hover:shadow-lg hover:shadow-pink-500/50',
      background: 'bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600',
      animation: 'animate-creator-bounce'
    }
  },

  // E-commerce Luxe
  {
    id: 'ecommerce-luxe',
    name: 'E-commerce Luxe',
    category: 'business',
    description: 'Template premium para vendas com elementos de luxo e conversão',
    preview: 'bg-gradient-to-br from-amber-50 to-amber-100',
    features: ['luxury-design', 'conversion-optimized', 'product-showcase', 'trust-elements', 'premium-feel'],
    customization: {
      colors: 'luxury-gold',
      typography: 'elegant-serif',
      layout: 'product-grid',
      animations: true
    },
    premium: true,
    styles: {
      container: 'min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50',
      card: 'bg-white/90 backdrop-blur-sm border border-amber-200/50 rounded-2xl shadow-luxury shadow-amber-500/20 relative overflow-hidden',
      link: 'bg-gradient-to-r from-amber-50/80 to-white/80 hover:from-amber-100/90 hover:to-amber-50/90 border border-amber-200/60 hover:border-amber-300/80 rounded-xl transition-all duration-400 hover:shadow-luxury-hover hover:scale-[1.02] transform',
      profile: 'text-center text-amber-900',
      social: 'bg-gradient-to-r from-amber-50/80 to-white/80 hover:from-amber-100/90 hover:to-amber-50/90 border border-amber-200/60 rounded-full transition-all duration-400 hover:scale-110',
      background: 'bg-gradient-to-br from-amber-50 via-white to-amber-50',
      animation: 'animate-luxury-float'
    }
  },
  {
    id: 'minimal',
    name: 'Minimal Clean',
    category: 'minimal',
    description: 'Design limpo e minimalista para profissionais',
    preview: 'bg-white border border-gray-200',
    features: ['clean-design', 'typography-focused', 'fast-loading'],
    customization: {
      colors: 'basic',
      typography: 'google-fonts',
      layout: 'fixed',
      animations: false
    },
    premium: false,
    styles: {
      container: 'min-h-screen bg-gray-50',
      card: 'bg-white border border-gray-200 rounded-lg shadow-sm max-w-md mx-auto',
      link: 'bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors duration-200',
      profile: 'text-center text-gray-900',
      social: 'bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-200',
      background: 'bg-gray-50'
    }
  },
  {
    id: 'neon-cyber',
    name: 'Neon Cyber',
    category: 'gaming',
    description: 'Estilo cyberpunk com efeitos neon',
    preview: 'bg-black border border-cyan-400 shadow-cyan-400/50',
    features: ['neon-effects', 'dark-theme', 'cyberpunk-style', 'glow-animations'],
    customization: {
      colors: 'advanced',
      typography: 'custom',
      layout: 'flexible',
      animations: true
    },
    premium: false,
    styles: {
      container: 'min-h-screen bg-black bg-grid-pattern',
      card: 'bg-gray-900/90 border border-cyan-400/50 rounded-lg shadow-xl shadow-cyan-400/20',
      link: 'bg-gray-900/50 hover:bg-gray-800/70 border border-cyan-400/30 hover:border-cyan-400/60 rounded-lg transition-all duration-300 hover:shadow-cyan-400/30 hover:shadow-lg',
      profile: 'text-center text-cyan-400',
      social: 'bg-gray-900/50 hover:bg-gray-800/70 border border-cyan-400/30 hover:border-cyan-400/60 rounded-full transition-all duration-300 hover:shadow-cyan-400/30',
      background: 'bg-black bg-grid-pattern',
      animation: 'animate-glow'
    }
  },

  // Templates Premium
  {
    id: 'gradient-mesh',
    name: 'Gradient Mesh Pro',
    category: 'creative',
    description: 'Gradientes complexos com efeito mesh animado',
    preview: 'bg-gradient-to-br from-violet-600 via-purple-600 to-blue-600',
    features: ['animated-gradients', 'mesh-effects', 'premium-animations', 'advanced-customization'],
    customization: {
      colors: 'full-palette',
      typography: 'google-fonts',
      layout: 'grid',
      animations: true
    },
    premium: true,
    styles: {
      container: 'min-h-screen bg-gradient-mesh animated-mesh',
      card: 'bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl',
      link: 'bg-gradient-to-r from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 backdrop-blur-sm border border-white/20 rounded-2xl transition-all duration-500 hover:scale-105 hover:rotate-1',
      profile: 'text-center text-white drop-shadow-lg',
      social: 'bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-all duration-500 hover:scale-125 hover:rotate-12',
      background: 'bg-gradient-mesh animated-mesh',
      animation: 'animate-float'
    }
  },
  {
    id: 'business-pro',
    name: 'Business Professional',
    category: 'business',
    description: 'Template corporativo com elementos de negócios',
    preview: 'bg-slate-800 border border-blue-500',
    features: ['corporate-design', 'professional-layout', 'business-icons', 'clean-typography'],
    customization: {
      colors: 'advanced',
      typography: 'google-fonts',
      layout: 'grid',
      animations: true
    },
    premium: true,
    styles: {
      container: 'min-h-screen bg-gradient-to-br from-slate-900 to-slate-800',
      card: 'bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-xl shadow-2xl',
      link: 'bg-slate-700/50 hover:bg-slate-600/70 border border-slate-600 hover:border-blue-500/50 rounded-lg transition-all duration-300 hover:shadow-blue-500/20',
      profile: 'text-center text-slate-100',
      social: 'bg-slate-700/50 hover:bg-slate-600/70 border border-slate-600 hover:border-blue-500/50 rounded-full transition-all duration-300',
      background: 'bg-gradient-to-br from-slate-900 to-slate-800'
    }
  },
  {
    id: 'social-media',
    name: 'Social Media Hub',
    category: 'social',
    description: 'Otimizado para criadores de conteúdo e influencers',
    preview: 'bg-gradient-to-br from-pink-400 to-purple-600',
    features: ['social-optimized', 'story-highlights', 'engagement-tools', 'creator-features'],
    customization: {
      colors: 'full-palette',
      typography: 'google-fonts',
      layout: 'flexible',
      animations: true
    },
    premium: true,
    styles: {
      container: 'min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600',
      card: 'bg-white/15 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl',
      link: 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 hover:from-pink-500/30 hover:to-purple-500/30 backdrop-blur-sm border border-white/30 rounded-2xl transition-all duration-400 hover:scale-105',
      profile: 'text-center text-white',
      social: 'bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full transition-all duration-400 hover:scale-110',
      background: 'bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600'
    }
  },
  {
    id: 'retro-wave',
    name: 'Retro Wave',
    category: 'creative',
    description: 'Estilo synthwave dos anos 80 com neon e gradientes',
    preview: 'bg-gradient-to-b from-purple-900 to-pink-900',
    features: ['retro-aesthetics', 'synthwave-colors', 'vintage-effects', 'nostalgic-design'],
    customization: {
      colors: 'advanced',
      typography: 'custom',
      layout: 'flexible',
      animations: true
    },
    premium: true,
    styles: {
      container: 'min-h-screen bg-gradient-to-b from-purple-900 via-pink-900 to-orange-900 bg-retro-grid',
      card: 'bg-black/50 backdrop-blur-sm border-2 border-pink-500/50 rounded-lg shadow-2xl shadow-pink-500/20',
      link: 'bg-gradient-to-r from-purple-900/50 to-pink-900/50 hover:from-purple-800/70 hover:to-pink-800/70 border border-pink-500/30 hover:border-pink-400/60 rounded-lg transition-all duration-300 hover:shadow-pink-500/30',
      profile: 'text-center text-pink-100',
      social: 'bg-gradient-to-r from-purple-900/50 to-pink-900/50 hover:from-purple-800/70 hover:to-pink-800/70 border border-pink-500/30 rounded-full transition-all duration-300',
      background: 'bg-gradient-to-b from-purple-900 via-pink-900 to-orange-900 bg-retro-grid'
    }
  }
]

export function getTemplate(id: string): TemplateConfig | null {
  return TEMPLATE_REGISTRY.find(template => template.id === id) || null
}

export function getTemplatesByCategory(category: string): TemplateConfig[] {
  return TEMPLATE_REGISTRY.filter(template => template.category === category)
}

export function getFreeTemplates(): TemplateConfig[] {
  return TEMPLATE_REGISTRY.filter(template => !template.premium)
}

export function getPremiumTemplates(): TemplateConfig[] {
  return TEMPLATE_REGISTRY.filter(template => template.premium)
}
