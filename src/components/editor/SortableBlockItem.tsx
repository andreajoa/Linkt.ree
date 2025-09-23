'use client'

import React, { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { motion } from 'framer-motion'
import {
  GripVertical,
  Eye,
  EyeOff,
  Copy,
  Trash2,
  Settings,
  ExternalLink,
  Image,
  Video,
  Music,
  Mail,
  CreditCard,
  ShoppingBag,
  Instagram,
  Twitter,
  Youtube,
  MessageCircle,
  Calendar,
  MapPin,
  QrCode,
  Palette,
  Type,
  Code
} from 'lucide-react'

import { Block } from '@/store'
import { cn } from '@/lib/utils'

interface SortableBlockItemProps {
  block: Block
  isSelected: boolean
  onSelect: () => void
  onUpdate: (updates: Partial<Block>) => void
  onDelete: () => void
  onDuplicate: () => void
}

// Block type icons mapping
const blockIcons = {
  link: ExternalLink,
  text: Type,
  image: Image,
  video: Video,
  social: Instagram,
  payment: CreditCard,
  product: ShoppingBag,
  email_capture: Mail,
  embed: Code,
  music: Music,
  calendar: Calendar,
  location: MapPin,
  qr_code: QrCode
}

// Social platform icons
const socialIcons = {
  instagram: Instagram,
  twitter: Twitter,
  youtube: Youtube,
  tiktok: Video,
  linkedin: ExternalLink,
  facebook: ExternalLink,
  discord: MessageCircle
}

export function SortableBlockItem({
  block,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  onDuplicate
}: SortableBlockItemProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const BlockIcon = blockIcons[block.type as keyof typeof blockIcons] || ExternalLink

  // Get block preview content
  const getBlockPreview = () => {
    switch (block.type) {
      case 'link':
        return {
          title: block.title || 'Untitled Link',
          subtitle: block.data?.url || 'No URL',
          icon: block.data?.icon ? socialIcons[block.data.icon as keyof typeof socialIcons] || ExternalLink : ExternalLink
        }
      case 'text':
        return {
          title: block.title || 'Text Block',
          subtitle: block.data?.content || 'No content',
          icon: Type
        }
      case 'image':
        return {
          title: block.title || 'Image Block',
          subtitle: block.data?.alt || 'Image',
          icon: Image
        }
      case 'video':
        return {
          title: block.title || 'Video Block',
          subtitle: block.data?.platform || 'Video',
          icon: Video
        }
      case 'social':
        const platform = block.data?.platform
        const SocialIcon = platform ? socialIcons[platform as keyof typeof socialIcons] : Instagram
        return {
          title: block.title || `${platform || 'Social'} Link`,
          subtitle: block.data?.username ? `@${block.data.username}` : 'Social media',
          icon: SocialIcon || Instagram
        }
      case 'payment':
        return {
          title: block.title || 'Payment Link',
          subtitle: block.data?.amount ? `$${block.data.amount}` : 'Payment',
          icon: CreditCard
        }
      case 'product':
        return {
          title: block.title || 'Product',
          subtitle: block.data?.price ? `$${block.data.price}` : 'Product',
          icon: ShoppingBag
        }
      case 'email_capture':
        return {
          title: block.title || 'Email Capture',
          subtitle: 'Collect emails',
          icon: Mail
        }
      case 'embed':
        return {
          title: block.title || 'Embed',
          subtitle: block.data?.type || 'Custom embed',
          icon: Code
        }
      default:
        return {
          title: block.title || 'Block',
          subtitle: block.type,
          icon: BlockIcon
        }
    }
  }

  const preview = getBlockPreview()
  const PreviewIcon = preview.icon

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative bg-white rounded-lg border-2 transition-all duration-200",
        isSelected 
          ? "border-blue-500 shadow-lg shadow-blue-500/20" 
          : "border-gray-200 hover:border-gray-300",
        isDragging && "opacity-50 rotate-3 scale-105",
        !block.isActive && "opacity-60"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onSelect}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className={cn(
          "absolute left-2 top-1/2 -translate-y-1/2 p-1 rounded cursor-grab active:cursor-grabbing transition-opacity",
          isHovered || isDragging ? "opacity-100" : "opacity-0"
        )}
      >
        <GripVertical className="w-4 h-4 text-gray-400" />
      </div>

      {/* Block Content */}
      <div className="p-4 pl-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Block Icon */}
            <div className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
              block.style?.backgroundColor 
                ? `bg-[${block.style.backgroundColor}]` 
                : "bg-gray-100"
            )}>
              <PreviewIcon className="w-4 h-4 text-gray-600" />
            </div>

            {/* Block Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-gray-900 truncate">
                  {preview.title}
                </h3>
                {!block.isActive && (
                  <EyeOff className="w-3 h-3 text-gray-400 flex-shrink-0" />
                )}
              </div>
              <p className="text-sm text-gray-500 truncate">
                {preview.subtitle}
              </p>
            </div>

            {/* Click Count */}
            <div className="text-xs text-gray-400 font-medium">
              {block.clicks} clicks
            </div>
          </div>

          {/* Actions */}
          <div className={cn(
            "flex items-center gap-1 ml-3 transition-opacity",
            isHovered || isSelected ? "opacity-100" : "opacity-0"
          )}>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onUpdate({ isActive: !block.isActive })
              }}
              className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
              title={block.isActive ? "Hide block" : "Show block"}
            >
              {block.isActive ? (
                <Eye className="w-3.5 h-3.5 text-gray-600" />
              ) : (
                <EyeOff className="w-3.5 h-3.5 text-gray-400" />
              )}
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowSettings(!showSettings)
              }}
              className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
              title="Block settings"
            >
              <Settings className="w-3.5 h-3.5 text-gray-600" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation()
                onDuplicate()
              }}
              className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
              title="Duplicate block"
            >
              <Copy className="w-3.5 h-3.5 text-gray-600" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete()
              }}
              className="p-1.5 rounded-md hover:bg-red-100 transition-colors"
              title="Delete block"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-600" />
            </button>
          </div>
        </div>

        {/* Block Settings Panel */}
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-gray-200"
          >
            <BlockSettings
              block={block}
              onUpdate={onUpdate}
              onClose={() => setShowSettings(false)}
            />
          </motion.div>
        )}
      </div>

      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white" />
      )}

      {/* Drag Overlay Effect */}
      {isDragging && (
        <div className="absolute inset-0 bg-blue-500/10 rounded-lg border-2 border-blue-500 border-dashed" />
      )}
    </div>
  )
}

// Block Settings Component
function BlockSettings({
  block,
  onUpdate,
  onClose
}: {
  block: Block
  onUpdate: (updates: Partial<Block>) => void
  onClose: () => void
}) {
  const [localData, setLocalData] = useState(block.data || {})
  const [localStyle, setLocalStyle] = useState(block.style || {})

  const handleSave = () => {
    onUpdate({
      data: localData,
      style: localStyle
    })
    onClose()
  }

  const renderBlockSpecificSettings = () => {
    switch (block.type) {
      case 'link':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                URL
              </label>
              <input
                type="url"
                value={localData.url || ''}
                onChange={(e) => setLocalData({ ...localData, url: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://example.com"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Description
              </label>
              <input
                type="text"
                value={localData.description || ''}
                onChange={(e) => setLocalData({ ...localData, description: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Link description"
              />
            </div>
          </div>
        )

      case 'text':
        return (
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Content
            </label>
            <textarea
              value={localData.content || ''}
              onChange={(e) => setLocalData({ ...localData, content: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Your text content"
              rows={3}
            />
          </div>
        )

      case 'payment':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Amount ($)
              </label>
              <input
                type="number"
                value={localData.amount || ''}
                onChange={(e) => setLocalData({ ...localData, amount: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Payment Type
              </label>
              <select
                value={localData.type || 'one_time'}
                onChange={(e) => setLocalData({ ...localData, type: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="one_time">One-time Payment</option>
                <option value="subscription">Subscription</option>
                <option value="donation">Donation</option>
              </select>
            </div>
          </div>
        )

      default:
        return (
          <div className="text-sm text-gray-500">
            No specific settings for this block type.
          </div>
        )
    }
  }

  return (
    <div className="space-y-4">
      {/* Block-specific settings */}
      {renderBlockSpecificSettings()}

      {/* Style Settings */}
      <div>
        <h4 className="text-xs font-medium text-gray-700 mb-2">Style</h4>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Background Color
            </label>
            <input
              type="color"
              value={localStyle.backgroundColor || '#ffffff'}
              onChange={(e) => setLocalStyle({ ...localStyle, backgroundColor: e.target.value })}
              className="w-full h-8 border border-gray-300 rounded cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Text Color
            </label>
            <input
              type="color"
              value={localStyle.textColor || '#000000'}
              onChange={(e) => setLocalStyle({ ...localStyle, textColor: e.target.value })}
              className="w-full h-8 border border-gray-300 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-2 pt-2">
        <button
          onClick={onClose}
          className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
        >
          Save
        </button>
      </div>
    </div>
  )
}



