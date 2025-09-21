'use client'

import React, { useState, useCallback, useEffect } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  UniqueIdentifier,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Palette, 
  Eye, 
  Code, 
  Smartphone, 
  Monitor, 
  Tablet,
  Grid3X3,
  Zap,
  Sparkles,
  Save,
  Undo,
  Redo,
  Copy,
  Trash2,
  Settings,
  MousePointer2
} from 'lucide-react'

import { useAppStore, useBlockActions, useEditorActions, Block } from '@/store'
import { SortableBlockItem } from './SortableBlockItem'
import { BlockToolbox } from './BlockToolbox'
import { ThemeEditor } from './ThemeEditor'
import { PreviewPane } from './PreviewPane'
import { CodeEditor } from './CodeEditor'
import { AIAssistant } from './AIAssistant'
import { cn } from '@/lib/utils'

interface DragDropEditorProps {
  pageId: string
  initialBlocks?: Block[]
}

export function DragDropEditor({ pageId, initialBlocks = [] }: DragDropEditorProps) {
  const {
    blocks,
    selectedBlockId,
    isEditing,
    previewMode,
    zoom,
    showGrid,
    sidebarOpen,
    theme,
    setBlocks,
    setSelectedBlockId,
    setPreviewMode,
    setZoom,
    setShowGrid,
    setSidebarOpen
  } = useAppStore()

  const { addBlock, updateBlock, deleteBlock, reorderBlocks, duplicateBlock } = useBlockActions()
  const { setIsEditing } = useEditorActions()

  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)
  const [showThemeEditor, setShowThemeEditor] = useState(false)
  const [showCodeEditor, setShowCodeEditor] = useState(false)
  const [showAIAssistant, setShowAIAssistant] = useState(false)
  const [devicePreview, setDevicePreview] = useState<'mobile' | 'tablet' | 'desktop'>('mobile')
  const [history, setHistory] = useState<Block[][]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Initialize blocks
  useEffect(() => {
    if (initialBlocks.length > 0) {
      setBlocks(initialBlocks)
    }
  }, [initialBlocks, setBlocks])

  // Save to history for undo/redo
  const saveToHistory = useCallback((newBlocks: Block[]) => {
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push([...newBlocks])
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }, [history, historyIndex])

  // Undo functionality
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const previousBlocks = history[historyIndex - 1]
      setBlocks(previousBlocks)
      setHistoryIndex(historyIndex - 1)
    }
  }, [history, historyIndex, setBlocks])

  // Redo functionality
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextBlocks = history[historyIndex + 1]
      setBlocks(nextBlocks)
      setHistoryIndex(historyIndex + 1)
    }
  }, [history, historyIndex, setBlocks])

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id)
  }

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      const oldIndex = blocks.findIndex((block) => block.id === active.id)
      const newIndex = blocks.findIndex((block) => block.id === over?.id)

      if (oldIndex !== -1 && newIndex !== -1) {
        const newBlocks = arrayMove(blocks, oldIndex, newIndex)
        setBlocks(newBlocks)
        saveToHistory(newBlocks)
        reorderBlocks(oldIndex, newIndex)
      }
    }

    setActiveId(null)
  }

  // Handle block selection
  const handleBlockSelect = (blockId: string) => {
    setSelectedBlockId(blockId === selectedBlockId ? null : blockId)
  }

  // Handle block deletion
  const handleBlockDelete = (blockId: string) => {
    deleteBlock(blockId)
    if (selectedBlockId === blockId) {
      setSelectedBlockId(null)
    }
    saveToHistory(blocks.filter(b => b.id !== blockId))
  }

  // Handle block duplication
  const handleBlockDuplicate = (blockId: string) => {
    duplicateBlock(blockId)
    saveToHistory([...blocks])
  }

  // Auto-save functionality
  useEffect(() => {
    const autoSave = setTimeout(() => {
      // Auto-save logic here
      console.log('Auto-saving...', blocks)
    }, 2000)

    return () => clearTimeout(autoSave)
  }, [blocks])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        switch (e.key) {
          case 'z':
            e.preventDefault()
            if (e.shiftKey) {
              redo()
            } else {
              undo()
            }
            break
          case 's':
            e.preventDefault()
            // Save functionality
            console.log('Saving...')
            break
          case 'd':
            if (selectedBlockId) {
              e.preventDefault()
              handleBlockDuplicate(selectedBlockId)
            }
            break
          case 'Delete':
          case 'Backspace':
            if (selectedBlockId) {
              e.preventDefault()
              handleBlockDelete(selectedBlockId)
            }
            break
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [selectedBlockId, undo, redo])

  const selectedBlock = blocks.find(b => b.id === selectedBlockId)

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="w-80 bg-white border-r border-gray-200 flex flex-col shadow-lg"
          >
            {/* Sidebar Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Editor</h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowAIAssistant(true)}
                    className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
                    title="AI Assistant"
                  >
                    <Sparkles className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    <MousePointer2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={undo}
                  disabled={historyIndex <= 0}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Undo (Cmd+Z)"
                >
                  <Undo className="w-4 h-4" />
                </button>
                <button
                  onClick={redo}
                  disabled={historyIndex >= history.length - 1}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Redo (Cmd+Shift+Z)"
                >
                  <Redo className="w-4 h-4" />
                </button>
                <div className="w-px h-6 bg-gray-300" />
                <button
                  onClick={() => setShowGrid(!showGrid)}
                  className={cn(
                    "p-2 rounded-lg transition-colors",
                    showGrid ? "bg-blue-100 text-blue-600" : "bg-gray-100 hover:bg-gray-200"
                  )}
                  title="Toggle Grid"
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowThemeEditor(true)}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                  title="Theme Editor"
                >
                  <Palette className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Block Toolbox */}
            <div className="flex-1 overflow-y-auto">
              <BlockToolbox onAddBlock={addBlock} />
            </div>

            {/* Selected Block Properties */}
            {selectedBlock && (
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Block Properties</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={selectedBlock.title || ''}
                      onChange={(e) => updateBlock(selectedBlock.id, { title: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Block title"
                    />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleBlockDuplicate(selectedBlock.id)}
                      className="flex-1 px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Copy className="w-3 h-3 mr-1 inline" />
                      Duplicate
                    </button>
                    <button
                      onClick={() => handleBlockDelete(selectedBlock.id)}
                      className="flex-1 px-3 py-2 text-xs font-medium text-red-700 bg-red-50 border border-red-300 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="w-3 h-3 mr-1 inline" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <Settings className="w-4 h-4" />
              </button>
            )}
            
            {/* Device Preview Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setDevicePreview('mobile')}
                className={cn(
                  "p-2 rounded-md transition-colors",
                  devicePreview === 'mobile' ? "bg-white shadow-sm" : "hover:bg-gray-200"
                )}
              >
                <Smartphone className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDevicePreview('tablet')}
                className={cn(
                  "p-2 rounded-md transition-colors",
                  devicePreview === 'tablet' ? "bg-white shadow-sm" : "hover:bg-gray-200"
                )}
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDevicePreview('desktop')}
                className={cn(
                  "p-2 rounded-md transition-colors",
                  devicePreview === 'desktop' ? "bg-white shadow-sm" : "hover:bg-gray-200"
                )}
              >
                <Monitor className="w-4 h-4" />
              </button>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                className="px-2 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors"
              >
                -
              </button>
              <span className="text-sm font-medium w-12 text-center">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={() => setZoom(Math.min(2, zoom + 0.1))}
                className="px-2 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className={cn(
                "px-4 py-2 rounded-lg font-medium transition-colors",
                previewMode 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              )}
            >
              <Eye className="w-4 h-4 mr-2 inline" />
              {previewMode ? 'Edit Mode' : 'Preview'}
            </button>
            
            <button
              onClick={() => setShowCodeEditor(true)}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Code className="w-4 h-4 mr-2 inline" />
              Code
            </button>
            
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <Save className="w-4 h-4 mr-2 inline" />
              Save
            </button>
          </div>
        </div>

        {/* Editor Canvas */}
        <div className="flex-1 overflow-hidden">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="h-full flex items-center justify-center p-8">
              <div 
                className={cn(
                  "relative bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300",
                  showGrid && "bg-grid-pattern",
                  {
                    'w-[375px] h-[812px]': devicePreview === 'mobile',
                    'w-[768px] h-[1024px]': devicePreview === 'tablet',
                    'w-[1024px] h-[768px]': devicePreview === 'desktop',
                  }
                )}
                style={{ 
                  transform: `scale(${zoom})`,
                  transformOrigin: 'center'
                }}
              >
                {previewMode ? (
                  <PreviewPane blocks={blocks} theme={theme} />
                ) : (
                  <div className="h-full overflow-y-auto p-6">
                    <SortableContext 
                      items={blocks.map(b => b.id)} 
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-4">
                        {blocks.map((block) => (
                          <SortableBlockItem
                            key={block.id}
                            block={block}
                            isSelected={selectedBlockId === block.id}
                            onSelect={() => handleBlockSelect(block.id)}
                            onUpdate={(updates) => updateBlock(block.id, updates)}
                            onDelete={() => handleBlockDelete(block.id)}
                            onDuplicate={() => handleBlockDuplicate(block.id)}
                          />
                        ))}
                      </div>
                    </SortableContext>

                    {/* Empty State */}
                    {blocks.length === 0 && (
                      <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <Plus className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          Start building your LinkTree
                        </h3>
                        <p className="text-gray-500 mb-4">
                          Drag blocks from the sidebar to get started
                        </p>
                        <button
                          onClick={() => setSidebarOpen(true)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Open Block Library
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Device Frame */}
                {devicePreview === 'mobile' && (
                  <div className="absolute inset-x-0 top-0 h-6 bg-black rounded-t-2xl flex items-center justify-center">
                    <div className="w-2 h-2 bg-gray-600 rounded-full" />
                  </div>
                )}
              </div>
            </div>

            <DragOverlay>
              {activeId ? (
                <div className="bg-white p-4 rounded-lg shadow-lg border-2 border-blue-500">
                  <div className="text-sm font-medium">
                    {blocks.find(b => b.id === activeId)?.title || 'Block'}
                  </div>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      </div>

      {/* Theme Editor Modal */}
      {showThemeEditor && (
        <ThemeEditor onClose={() => setShowThemeEditor(false)} />
      )}

      {/* Code Editor Modal */}
      {showCodeEditor && (
        <CodeEditor onClose={() => setShowCodeEditor(false)} />
      )}

      {/* AI Assistant Modal */}
      {showAIAssistant && (
        <AIAssistant onClose={() => setShowAIAssistant(false)} />
      )}
    </div>
  )
}

