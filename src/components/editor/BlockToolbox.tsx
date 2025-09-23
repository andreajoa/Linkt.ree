'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ExternalLink,
  Type,
  Image,
  Video,
  Instagram,
  CreditCard,
  ShoppingBag,
  Mail,
  Code,
  Music,
  Calendar,
  MapPin,
  QrCode,
  Palette,
  Sparkles,
  Search,
  Grid,
  List,
  Star,
  Zap,
  Heart,
  MessageCircle,
  Phone,
  Globe,
  FileText,
  BarChart3,
  Gift,
  Coffee,
  Headphones,
  Camera,
  Mic,
  Play,
  Download,
  Share,
  Bookmark
} from 'lucide-react'

import { Block } from '@/store'
import { cn } from '@/lib/utils'

interface BlockToolboxProps {
  onAddBlock: (block: Omit<Block, 'id' | 'position'>) => void
}

interface BlockTemplate {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  type: Block['type']
  category: string
  isPremium?: boolean
  data: Record<string, any>
  style?: Record<string, any>
}

// Comprehensive block templates
const blockTemplates: BlockTemplate[] = [
  // Basic Blocks
  {
    id: 'basic-link',
    name: 'Link',
    description: 'Basic clickable link',
    icon: <ExternalLink className="w-5 h-5" />,
    type: 'link',
    category: 'basic',
    data: {
      url: 'https://example.com',
      openInNewTab: true
    }
  },
  {
    id: 'text-block',
    name: 'Text',
    description: 'Rich text content',
    icon: <Type className="w-5 h-5" />,
    type: 'text',
    category: 'basic',
    data: {
      content: 'Your text here...',
      alignment: 'center'
    }
  },
  {
    id: 'image-block',
    name: 'Image',
    description: 'Display an image',
    icon: <Image className="w-5 h-5" />,
    type: 'image',
    category: 'media',
    data: {
      src: '',
      alt: 'Image description',
      caption: ''
    }
  },

  // Social Media Blocks
  {
    id: 'instagram-link',
    name: 'Instagram',
    description: 'Link to Instagram profile',
    icon: <Instagram className="w-5 h-5" />,
    type: 'social',
    category: 'social',
    data: {
      platform: 'instagram',
      username: '',
      url: '',
      showFollowers: false
    },
    style: {
      backgroundColor: '#E4405F',
      textColor: '#ffffff'
    }
  },
  {
    id: 'twitter-link',
    name: 'Twitter/X',
    description: 'Link to Twitter profile',
    icon: <MessageCircle className="w-5 h-5" />,
    type: 'social',
    category: 'social',
    data: {
      platform: 'twitter',
      username: '',
      url: '',
      showFollowers: false
    },
    style: {
      backgroundColor: '#1DA1F2',
      textColor: '#ffffff'
    }
  },
  {
    id: 'youtube-link',
    name: 'YouTube',
    description: 'Link to YouTube channel',
    icon: <Play className="w-5 h-5" />,
    type: 'social',
    category: 'social',
    data: {
      platform: 'youtube',
      username: '',
      url: '',
      showSubscribers: false
    },
    style: {
      backgroundColor: '#FF0000',
      textColor: '#ffffff'
    }
  },
  {
    id: 'tiktok-link',
    name: 'TikTok',
    description: 'Link to TikTok profile',
    icon: <Video className="w-5 h-5" />,
    type: 'social',
    category: 'social',
    data: {
      platform: 'tiktok',
      username: '',
      url: '',
      showFollowers: false
    },
    style: {
      backgroundColor: '#000000',
      textColor: '#ffffff'
    }
  },

  // Media Blocks
  {
    id: 'youtube-video',
    name: 'YouTube Video',
    description: 'Embed YouTube video',
    icon: <Video className="w-5 h-5" />,
    type: 'video',
    category: 'media',
    data: {
      platform: 'youtube',
      videoId: '',
      autoplay: false,
      showControls: true
    }
  },
  {
    id: 'spotify-track',
    name: 'Spotify',
    description: 'Embed Spotify track/playlist',
    icon: <Music className="w-5 h-5" />,
    type: 'embed',
    category: 'media',
    data: {
      platform: 'spotify',
      embedId: '',
      type: 'track'
    },
    style: {
      backgroundColor: '#1DB954',
      textColor: '#ffffff'
    }
  },
  {
    id: 'soundcloud-track',
    name: 'SoundCloud',
    description: 'Embed SoundCloud track',
    icon: <Headphones className="w-5 h-5" />,
    type: 'embed',
    category: 'media',
    data: {
      platform: 'soundcloud',
      embedId: '',
      autoplay: false
    },
    style: {
      backgroundColor: '#FF5500',
      textColor: '#ffffff'
    }
  },

  // E-commerce Blocks
  {
    id: 'product-showcase',
    name: 'Product',
    description: 'Showcase a product for sale',
    icon: <ShoppingBag className="w-5 h-5" />,
    type: 'product',
    category: 'ecommerce',
    isPremium: true,
    data: {
      name: 'Product Name',
      price: 0,
      currency: 'USD',
      description: '',
      images: [],
      buyNowUrl: '',
      inStock: true
    }
  },
  {
    id: 'payment-link',
    name: 'Payment',
    description: 'Accept payments directly',
    icon: <CreditCard className="w-5 h-5" />,
    type: 'payment',
    category: 'ecommerce',
    isPremium: true,
    data: {
      amount: 0,
      currency: 'USD',
      type: 'one_time',
      description: 'Payment for services'
    },
    style: {
      backgroundColor: '#00D924',
      textColor: '#ffffff'
    }
  },
  {
    id: 'tip-jar',
    name: 'Tip Jar',
    description: 'Receive tips from supporters',
    icon: <Coffee className="w-5 h-5" />,
    type: 'payment',
    category: 'ecommerce',
    data: {
      type: 'tip',
      minAmount: 1,
      suggestedAmounts: [5, 10, 20, 50],
      message: 'Support my work!'
    },
    style: {
      backgroundColor: '#FFDD00',
      textColor: '#000000'
    }
  },
  {
    id: 'donation-button',
    name: 'Donate',
    description: 'Accept donations',
    icon: <Heart className="w-5 h-5" />,
    type: 'payment',
    category: 'ecommerce',
    data: {
      type: 'donation',
      cause: 'Support my cause',
      goalAmount: 0
    },
    style: {
      backgroundColor: '#FF6B9D',
      textColor: '#ffffff'
    }
  },

  // Lead Generation
  {
    id: 'email-capture',
    name: 'Email Signup',
    description: 'Collect email addresses',
    icon: <Mail className="w-5 h-5" />,
    type: 'email_capture',
    category: 'marketing',
    data: {
      placeholder: 'Enter your email',
      buttonText: 'Subscribe',
      successMessage: 'Thanks for subscribing!',
      integration: 'mailchimp'
    }
  },
  {
    id: 'newsletter-signup',
    name: 'Newsletter',
    description: 'Newsletter subscription form',
    icon: <FileText className="w-5 h-5" />,
    type: 'email_capture',
    category: 'marketing',
    data: {
      title: 'Join my newsletter',
      description: 'Get weekly updates',
      placeholder: 'Your email address',
      buttonText: 'Join Newsletter',
      integration: 'convertkit'
    }
  },

  // Business & Professional
  {
    id: 'calendar-booking',
    name: 'Book Meeting',
    description: 'Schedule appointments',
    icon: <Calendar className="w-5 h-5" />,
    type: 'embed',
    category: 'business',
    isPremium: true,
    data: {
      platform: 'calendly',
      calendarUrl: '',
      duration: 30,
      timezone: 'UTC'
    }
  },
  {
    id: 'contact-info',
    name: 'Contact',
    description: 'Display contact information',
    icon: <Phone className="w-5 h-5" />,
    type: 'text',
    category: 'business',
    data: {
      content: 'Get in touch',
      phone: '',
      email: '',
      address: ''
    }
  },
  {
    id: 'location-map',
    name: 'Location',
    description: 'Show location on map',
    icon: <MapPin className="w-5 h-5" />,
    type: 'embed',
    category: 'business',
    data: {
      address: '',
      coordinates: { lat: 0, lng: 0 },
      showMap: true
    }
  },

  // Interactive & Fun
  {
    id: 'qr-code',
    name: 'QR Code',
    description: 'Generate QR code for your page',
    icon: <QrCode className="w-5 h-5" />,
    type: 'embed',
    category: 'utility',
    data: {
      content: window.location.href,
      size: 200,
      includeText: true
    }
  },
  {
    id: 'countdown-timer',
    name: 'Countdown',
    description: 'Countdown to an event',
    icon: <BarChart3 className="w-5 h-5" />,
    type: 'embed',
    category: 'utility',
    isPremium: true,
    data: {
      targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      title: 'Big Announcement',
      showLabels: true
    }
  },
  {
    id: 'review-widget',
    name: 'Reviews',
    description: 'Display customer reviews',
    icon: <Star className="w-5 h-5" />,
    type: 'embed',
    category: 'social',
    isPremium: true,
    data: {
      platform: 'google',
      businessId: '',
      showRating: true,
      maxReviews: 3
    }
  },

  // Content & Media
  {
    id: 'podcast-episode',
    name: 'Podcast',
    description: 'Embed podcast episode',
    icon: <Mic className="w-5 h-5" />,
    type: 'embed',
    category: 'media',
    data: {
      platform: 'spotify',
      episodeId: '',
      showDescription: true
    }
  },
  {
    id: 'blog-post',
    name: 'Blog Post',
    description: 'Link to latest blog post',
    icon: <FileText className="w-5 h-5" />,
    type: 'link',
    category: 'content',
    data: {
      url: '',
      showPreview: true,
      excerpt: ''
    }
  },
  {
    id: 'portfolio-gallery',
    name: 'Portfolio',
    description: 'Showcase your work',
    icon: <Camera className="w-5 h-5" />,
    type: 'embed',
    category: 'creative',
    isPremium: true,
    data: {
      images: [],
      layout: 'grid',
      showCaptions: true
    }
  },

  // Advanced
  {
    id: 'custom-html',
    name: 'Custom Code',
    description: 'Add custom HTML/CSS/JS',
    icon: <Code className="w-5 h-5" />,
    type: 'embed',
    category: 'advanced',
    isPremium: true,
    data: {
      html: '<div>Custom content</div>',
      css: '',
      js: ''
    }
  },
  {
    id: 'iframe-embed',
    name: 'Website Embed',
    description: 'Embed any website',
    icon: <Globe className="w-5 h-5" />,
    type: 'embed',
    category: 'advanced',
    data: {
      url: '',
      height: 400,
      allowFullscreen: false
    }
  }
]

const categories = [
  { id: 'basic', name: 'Basic', icon: <Grid className="w-4 h-4" /> },
  { id: 'social', name: 'Social', icon: <Instagram className="w-4 h-4" /> },
  { id: 'media', name: 'Media', icon: <Video className="w-4 h-4" /> },
  { id: 'ecommerce', name: 'E-commerce', icon: <ShoppingBag className="w-4 h-4" /> },
  { id: 'marketing', name: 'Marketing', icon: <Mail className="w-4 h-4" /> },
  { id: 'business', name: 'Business', icon: <Calendar className="w-4 h-4" /> },
  { id: 'utility', name: 'Utility', icon: <QrCode className="w-4 h-4" /> },
  { id: 'content', name: 'Content', icon: <FileText className="w-4 h-4" /> },
  { id: 'creative', name: 'Creative', icon: <Camera className="w-4 h-4" /> },
  { id: 'advanced', name: 'Advanced', icon: <Code className="w-4 h-4" /> }
]

export function BlockToolbox({ onAddBlock }: BlockToolboxProps) {
  const [selectedCategory, setSelectedCategory] = useState('basic')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const filteredBlocks = blockTemplates.filter(block => {
    const matchesCategory = selectedCategory === 'all' || block.category === selectedCategory
    const matchesSearch = searchQuery === '' || 
      block.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      block.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesCategory && matchesSearch
  })

  const handleAddBlock = (template: BlockTemplate) => {
    onAddBlock({
      type: template.type,
      title: template.name,
      data: { ...template.data },
      style: { ...template.style },
      isActive: true,
      clicks: 0
    })
  }

  return (
    <div className="h-full flex flex-col">
      {/* Search */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search blocks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-900">Categories</h3>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                "p-1 rounded",
                viewMode === 'grid' ? "bg-blue-100 text-blue-600" : "text-gray-400 hover:text-gray-600"
              )}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                "p-1 rounded",
                viewMode === 'list' ? "bg-blue-100 text-blue-600" : "text-gray-400 hover:text-gray-600"
              )}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors",
                selectedCategory === category.id
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              {category.icon}
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Blocks */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className={cn(
          "gap-3",
          viewMode === 'grid' ? "grid grid-cols-1" : "space-y-2"
        )}>
          {filteredBlocks.map((template) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "group relative bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer",
                viewMode === 'grid' ? "p-4" : "p-3"
              )}
              onClick={() => handleAddBlock(template)}
            >
              <div className={cn(
                "flex items-center gap-3",
                viewMode === 'grid' ? "flex-col text-center" : "flex-row"
              )}>
                {/* Icon */}
                <div className={cn(
                  "flex items-center justify-center rounded-lg bg-gray-100 text-gray-600 flex-shrink-0",
                  viewMode === 'grid' ? "w-12 h-12" : "w-8 h-8"
                )}>
                  {template.icon}
                </div>

                {/* Content */}
                <div className={cn(
                  "flex-1 min-w-0",
                  viewMode === 'grid' ? "text-center" : "text-left"
                )}>
                  <div className="flex items-center gap-2 justify-center">
                    <h4 className={cn(
                      "font-medium text-gray-900",
                      viewMode === 'grid' ? "text-sm" : "text-xs"
                    )}>
                      {template.name}
                    </h4>
                    {template.isPremium && (
                      <Star className="w-3 h-3 text-yellow-500" />
                    )}
                  </div>
                  <p className={cn(
                    "text-gray-500 mt-1",
                    viewMode === 'grid' ? "text-xs" : "text-xs"
                  )}>
                    {template.description}
                  </p>
                </div>
              </div>

              {/* Add Button */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center">
                  <Plus className="w-3 h-3" />
                </div>
              </div>

              {/* Premium Badge */}
              {template.isPremium && (
                <div className="absolute top-2 left-2">
                  <div className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-medium rounded-full">
                    PRO
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredBlocks.length === 0 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">
              No blocks found
            </h3>
            <p className="text-sm text-gray-500">
              Try adjusting your search or category filter
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-center">
          <p className="text-xs text-gray-500">
            {filteredBlocks.length} blocks available
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Drag blocks to add them to your page
          </p>
        </div>
      </div>
    </div>
  )
}



