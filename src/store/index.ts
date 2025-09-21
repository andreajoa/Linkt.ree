import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

// Types
export interface Block {
  id: string
  type: 'link' | 'text' | 'image' | 'video' | 'social' | 'payment' | 'product' | 'email_capture' | 'embed'
  position: number
  title?: string
  data: Record<string, any>
  style?: BlockStyle
  isActive: boolean
  clicks: number
}

export interface BlockStyle {
  backgroundColor: string
  textColor: string
  borderRadius: number
  shadow: boolean
  animation: 'none' | 'pulse' | 'bounce' | 'glow' | 'float'
  gradient?: {
    from: string
    to: string
    direction: string
  }
  border?: {
    width: number
    color: string
    style: 'solid' | 'dashed' | 'dotted'
  }
}

export interface ThemeConfig {
  colors: {
    primary: string
    secondary: string
    background: string
    text: string
    accent: string
  }
  fonts: {
    heading: string
    body: string
    custom?: string
  }
  layout: {
    maxWidth: number
    spacing: number
    borderRadius: number
  }
  animations: {
    enabled: boolean
    duration: number
    easing: string
  }
  background: {
    type: 'solid' | 'gradient' | 'image' | 'video'
    value: string
    opacity: number
  }
}

export interface Page {
  id: string
  userId: string
  slug: string
  title?: string
  description?: string
  isPublic: boolean
  seoTitle?: string
  seoDescription?: string
  customDomain?: string
  themeConfig?: ThemeConfig
  favicon?: string
  password?: string
  blocks: Block[]
}

export interface User {
  id: string
  username?: string
  name?: string
  email?: string
  image?: string
  bio?: string
  plan: 'free' | 'pro' | 'business'
  isPremium: boolean
  aiCredits: number
  customDomain?: string
}

// Store State
interface AppState {
  // User
  user: User | null
  setUser: (user: User | null) => void
  
  // Current Page
  currentPage: Page | null
  setCurrentPage: (page: Page | null) => void
  
  // Blocks
  blocks: Block[]
  setBlocks: (blocks: Block[]) => void
  addBlock: (block: Omit<Block, 'id' | 'position'>) => void
  updateBlock: (id: string, updates: Partial<Block>) => void
  deleteBlock: (id: string) => void
  reorderBlocks: (startIndex: number, endIndex: number) => void
  duplicateBlock: (id: string) => void
  
  // Theme
  theme: ThemeConfig
  setTheme: (theme: Partial<ThemeConfig>) => void
  resetTheme: () => void
  
  // Editor State
  selectedBlockId: string | null
  setSelectedBlockId: (id: string | null) => void
  isEditing: boolean
  setIsEditing: (editing: boolean) => void
  previewMode: boolean
  setPreviewMode: (preview: boolean) => void
  
  // UI State
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  showGrid: boolean
  setShowGrid: (show: boolean) => void
  zoom: number
  setZoom: (zoom: number) => void
  
  // Analytics
  analytics: {
    pageViews: number
    totalClicks: number
    topBlocks: Array<{ id: string; clicks: number }>
  }
  setAnalytics: (analytics: any) => void
  
  // Loading States
  loading: {
    page: boolean
    blocks: boolean
    saving: boolean
    publishing: boolean
  }
  setLoading: (key: keyof AppState['loading'], value: boolean) => void
}

// Default Theme
const defaultTheme: ThemeConfig = {
  colors: {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    background: '#ffffff',
    text: '#1f2937',
    accent: '#f59e0b'
  },
  fonts: {
    heading: 'Inter',
    body: 'Inter'
  },
  layout: {
    maxWidth: 400,
    spacing: 16,
    borderRadius: 12
  },
  animations: {
    enabled: true,
    duration: 300,
    easing: 'ease-in-out'
  },
  background: {
    type: 'gradient',
    value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    opacity: 1
  }
}

// Store Implementation
export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set, get) => ({
        // User
        user: null,
        setUser: (user) => set({ user }, false, 'setUser'),
        
        // Current Page
        currentPage: null,
        setCurrentPage: (page) => set({ currentPage: page }, false, 'setCurrentPage'),
        
        // Blocks
        blocks: [],
        setBlocks: (blocks) => set({ blocks }, false, 'setBlocks'),
        
        addBlock: (blockData) => {
          const blocks = get().blocks
          const newBlock: Block = {
            ...blockData,
            id: `block_${Date.now()}`,
            position: blocks.length,
            clicks: 0
          }
          set({ blocks: [...blocks, newBlock] }, false, 'addBlock')
        },
        
        updateBlock: (id, updates) => {
          const blocks = get().blocks.map(block =>
            block.id === id ? { ...block, ...updates } : block
          )
          set({ blocks }, false, 'updateBlock')
        },
        
        deleteBlock: (id) => {
          const blocks = get().blocks
            .filter(block => block.id !== id)
            .map((block, index) => ({ ...block, position: index }))
          set({ blocks }, false, 'deleteBlock')
        },
        
        reorderBlocks: (startIndex, endIndex) => {
          const blocks = [...get().blocks]
          const [removed] = blocks.splice(startIndex, 1)
          blocks.splice(endIndex, 0, removed)
          
          // Update positions
          const reorderedBlocks = blocks.map((block, index) => ({
            ...block,
            position: index
          }))
          
          set({ blocks: reorderedBlocks }, false, 'reorderBlocks')
        },
        
        duplicateBlock: (id) => {
          const blocks = get().blocks
          const blockToDuplicate = blocks.find(block => block.id === id)
          if (blockToDuplicate) {
            const newBlock: Block = {
              ...blockToDuplicate,
              id: `block_${Date.now()}`,
              position: blockToDuplicate.position + 1,
              title: `${blockToDuplicate.title} (Copy)`,
              clicks: 0
            }
            
            // Insert after the original block
            const updatedBlocks = [
              ...blocks.slice(0, blockToDuplicate.position + 1),
              newBlock,
              ...blocks.slice(blockToDuplicate.position + 1)
            ].map((block, index) => ({ ...block, position: index }))
            
            set({ blocks: updatedBlocks }, false, 'duplicateBlock')
          }
        },
        
        // Theme
        theme: defaultTheme,
        setTheme: (themeUpdates) => {
          const currentTheme = get().theme
          const newTheme = {
            ...currentTheme,
            ...themeUpdates,
            colors: { ...currentTheme.colors, ...themeUpdates.colors },
            fonts: { ...currentTheme.fonts, ...themeUpdates.fonts },
            layout: { ...currentTheme.layout, ...themeUpdates.layout },
            animations: { ...currentTheme.animations, ...themeUpdates.animations },
            background: { ...currentTheme.background, ...themeUpdates.background }
          }
          set({ theme: newTheme }, false, 'setTheme')
        },
        
        resetTheme: () => set({ theme: defaultTheme }, false, 'resetTheme'),
        
        // Editor State
        selectedBlockId: null,
        setSelectedBlockId: (id) => set({ selectedBlockId: id }, false, 'setSelectedBlockId'),
        isEditing: false,
        setIsEditing: (editing) => set({ isEditing: editing }, false, 'setIsEditing'),
        previewMode: false,
        setPreviewMode: (preview) => set({ previewMode: preview }, false, 'setPreviewMode'),
        
        // UI State
        sidebarOpen: true,
        setSidebarOpen: (open) => set({ sidebarOpen: open }, false, 'setSidebarOpen'),
        showGrid: false,
        setShowGrid: (show) => set({ showGrid: show }, false, 'setShowGrid'),
        zoom: 1,
        setZoom: (zoom) => set({ zoom: Math.max(0.5, Math.min(2, zoom)) }, false, 'setZoom'),
        
        // Analytics
        analytics: {
          pageViews: 0,
          totalClicks: 0,
          topBlocks: []
        },
        setAnalytics: (analytics) => set({ analytics }, false, 'setAnalytics'),
        
        // Loading States
        loading: {
          page: false,
          blocks: false,
          saving: false,
          publishing: false
        },
        setLoading: (key, value) => {
          const loading = { ...get().loading, [key]: value }
          set({ loading }, false, 'setLoading')
        }
      }),
      {
        name: 'linktree-pro-store',
        partialize: (state) => ({
          theme: state.theme,
          sidebarOpen: state.sidebarOpen,
          showGrid: state.showGrid,
          zoom: state.zoom
        })
      }
    ),
    {
      name: 'LinkTree Pro Store'
    }
  )
)

// Selectors (for performance optimization)
export const useBlocks = () => useAppStore(state => state.blocks)
export const useSelectedBlock = () => {
  const selectedId = useAppStore(state => state.selectedBlockId)
  const blocks = useAppStore(state => state.blocks)
  return blocks.find(block => block.id === selectedId) || null
}
export const useTheme = () => useAppStore(state => state.theme)
export const useUser = () => useAppStore(state => state.user)
export const useCurrentPage = () => useAppStore(state => state.currentPage)
export const useEditorState = () => useAppStore(state => ({
  isEditing: state.isEditing,
  previewMode: state.previewMode,
  selectedBlockId: state.selectedBlockId,
  zoom: state.zoom,
  showGrid: state.showGrid
}))

// Actions
export const useBlockActions = () => useAppStore(state => ({
  addBlock: state.addBlock,
  updateBlock: state.updateBlock,
  deleteBlock: state.deleteBlock,
  reorderBlocks: state.reorderBlocks,
  duplicateBlock: state.duplicateBlock,
  setSelectedBlockId: state.setSelectedBlockId
}))

export const useThemeActions = () => useAppStore(state => ({
  setTheme: state.setTheme,
  resetTheme: state.resetTheme
}))

export const useEditorActions = () => useAppStore(state => ({
  setIsEditing: state.setIsEditing,
  setPreviewMode: state.setPreviewMode,
  setSelectedBlockId: state.setSelectedBlockId,
  setZoom: state.setZoom,
  setShowGrid: state.setShowGrid
}))
