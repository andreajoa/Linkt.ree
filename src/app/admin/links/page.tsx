'use client'

import React, { useState } from 'react'
import { 
  Plus, 
  Settings,
  BarChart3,
  Users,
  Palette,
  Link2,
  Eye,
  GripVertical,
  Camera,
  Youtube,
  Instagram,
  ChevronDown,
  MoreHorizontal,
  ExternalLink,
  Copy,
  Edit,
  Trash2,
  Search,
  X,
  Save,
  EyeOff,
  Image,
  Type,
  Sparkles,
  Zap
} from 'lucide-react'

// Templates disponíveis
const templates = [
  { 
    id: 'default', 
    name: 'Default', 
    preview: 'bg-white',
    description: 'Clean and simple'
  },
  { 
    id: 'glassmorphism', 
    name: 'Glassmorphism', 
    preview: 'bg-gradient-to-br from-purple-400 to-pink-400',
    description: 'Modern glass effect'
  },
  { 
    id: 'neon', 
    name: 'Neon', 
    preview: 'bg-black',
    description: 'Cyberpunk vibes'
  },
  { 
    id: 'minimal', 
    name: 'Minimal', 
    preview: 'bg-gray-100',
    description: 'Less is more'
  },
  { 
    id: 'gradient', 
    name: 'Gradient', 
    preview: 'bg-gradient-to-r from-blue-500 to-purple-600',
    description: 'Colorful gradients'
  },
  { 
    id: 'dark', 
    name: 'Dark Mode', 
    preview: 'bg-gray-900',
    description: 'Easy on the eyes'
  }
]

// Backgrounds disponíveis
const backgrounds = [
  { id: 'cosmic', name: 'Cosmic', class: 'bg-gradient-to-br from-purple-600 to-blue-600' },
  { id: 'sunset', name: 'Sunset', class: 'bg-gradient-to-br from-orange-400 to-pink-600' },
  { id: 'ocean', name: 'Ocean', class: 'bg-gradient-to-br from-blue-400 to-teal-500' },
  { id: 'forest', name: 'Forest', class: 'bg-gradient-to-br from-green-400 to-emerald-600' },
  { id: 'rose', name: 'Rose Gold', class: 'bg-gradient-to-br from-pink-300 to-rose-500' },
  { id: 'monochrome', name: 'Monochrome', class: 'bg-gradient-to-br from-gray-700 to-gray-900' }
]

export default function CompleteLinktreeAdmin() {
  const [currentTemplate, setCurrentTemplate] = useState('default')
  const [currentBackground, setCurrentBackground] = useState('cosmic')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [showDesignPanel, setShowDesignPanel] = useState(false)
  const [editingLink, setEditingLink] = useState(null)
  
  const [profile, setProfile] = useState({
    name: 'Margareth Almeida',
    bio: 'Neuropsicopedagoga | Autismo & TDAH Transformando desafios em conquistas',
    avatar: null,
    socials: {
      instagram: '',
      tiktok: '',
      youtube: '',
      twitter: ''
    }
  })

  const [links, setLinks] = useState([
    { id: 1, title: 'MATERIAL APOIO TDAH FREE DOWNLOAD', url: 'https://drive.google.com/file/d/19_slnx...', isActive: true, clicks: 1234 },
    { id: 2, title: 'O Mundo Colorido de Leo', url: 'https://example.com/leo', isActive: true, clicks: 890 },
    { id: 3, title: 'Download Material de Apoio Grátis', url: 'https://example.com/download', isActive: true, clicks: 567 },
    { id: 4, title: 'Your Survival Pack for ADHD & Autism Families', url: 'https://example.com/survival', isActive: true, clicks: 234 }
  ])

  const [newLink, setNewLink] = useState({
    title: '',
    url: '',
    description: ''
  })

  // Adicionar novo link
  const addLink = () => {
    if (newLink.title && newLink.url) {
      const link = {
        id: Date.now(),
        title: newLink.title,
        url: newLink.url,
        description: newLink.description,
        isActive: true,
        clicks: 0
      }
      setLinks([...links, link])
      setNewLink({ title: '', url: '', description: '' })
      setShowAddModal(false)
    }
  }

  // Deletar link
  const deleteLink = (id) => {
    setLinks(links.filter(link => link.id !== id))
  }

  // Toggle ativação do link
  const toggleLink = (id) => {
    setLinks(links.map(link => 
      link.id === id ? { ...link, isActive: !link.isActive } : link
    ))
  }

  // Editar link
  const updateLink = (id, updatedData) => {
    setLinks(links.map(link => 
      link.id === id ? { ...link, ...updatedData } : link
    ))
  }

  // Modal de adicionar link
  const AddLinkModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Adicionar novo link</h3>
          <button 
            onClick={() => setShowAddModal(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
            <input
              type="text"
              value={newLink.title}
              onChange={(e) => setNewLink({...newLink, title: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Ex: Meu Portfolio"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">URL</label>
            <input
              type="url"
              value={newLink.url}
              onChange={(e) => setNewLink({...newLink, url: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="https://exemplo.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Descrição (opcional)</label>
            <input
              type="text"
              value={newLink.description}
              onChange={(e) => setNewLink({...newLink, description: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Breve descrição"
            />
          </div>
          
          <div className="flex space-x-3 pt-4">
            <button 
              onClick={addLink}
              className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              Adicionar Link
            </button>
            <button 
              onClick={() => setShowAddModal(false)}
              className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  // Modal de templates
  const TemplateModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Escolher Template</h3>
          <button 
            onClick={() => setShowTemplateModal(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div 
              key={template.id}
              className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                currentTemplate === template.id 
                  ? 'border-purple-500 bg-purple-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => {
                setCurrentTemplate(template.id)
                setShowTemplateModal(false)
              }}
            >
              <div className={`w-full h-32 rounded-lg mb-3 ${template.preview} flex items-center justify-center`}>
                <div className="text-white font-medium">{template.name}</div>
              </div>
              <h4 className="font-medium text-gray-900 mb-1">{template.name}</h4>
              <p className="text-sm text-gray-600">{template.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  // Painel de design
  const DesignPanel = () => (
    <div className="fixed right-0 top-0 h-full w-80 bg-white border-l border-gray-200 shadow-xl z-40 overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">Personalizar Design</h3>
          <button 
            onClick={() => setShowDesignPanel(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Templates */}
        <div className="mb-8">
          <h4 className="font-medium text-gray-900 mb-4 flex items-center">
            <Type className="w-4 h-4 mr-2" />
            Templates
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {templates.slice(0, 4).map((template) => (
              <button
                key={template.id}
                onClick={() => setCurrentTemplate(template.id)}
                className={`p-3 border-2 rounded-lg transition-all ${
                  currentTemplate === template.id 
                    ? 'border-purple-500 bg-purple-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`w-full h-16 rounded mb-2 ${template.preview}`}></div>
                <div className="text-xs font-medium text-gray-700">{template.name}</div>
              </button>
            ))}
          </div>
          <button 
            onClick={() => setShowTemplateModal(true)}
            className="w-full mt-3 p-2 border border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-gray-400"
          >
            Ver todos os templates
          </button>
        </div>
        
        {/* Backgrounds */}
        <div className="mb-8">
          <h4 className="font-medium text-gray-900 mb-4 flex items-center">
            <Image className="w-4 h-4 mr-2" />
            Backgrounds
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {backgrounds.map((bg) => (
              <button
                key={bg.id}
                onClick={() => setCurrentBackground(bg.id)}
                className={`p-3 border-2 rounded-lg transition-all ${
                  currentBackground === bg.id 
                    ? 'border-purple-500' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`w-full h-16 rounded mb-2 ${bg.class}`}></div>
                <div className="text-xs font-medium text-gray-700">{bg.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Efeitos */}
        <div className="mb-8">
          <h4 className="font-medium text-gray-900 mb-4 flex items-center">
            <Sparkles className="w-4 h-4 mr-2" />
            Efeitos
          </h4>
          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Animações</span>
              <input type="checkbox" className="toggle" defaultChecked />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Sombras</span>
              <input type="checkbox" className="toggle" defaultChecked />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Blur Effect</span>
              <input type="checkbox" className="toggle" />
            </label>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-48 bg-white border-r border-gray-200 fixed left-0 top-0 h-full z-10 overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-purple-600 rounded-sm flex items-center justify-center">
              <span className="text-white text-xs font-bold">L</span>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">Margareth Almeida</div>
              <ChevronDown className="w-3 h-3 text-gray-500" />
            </div>
          </div>
        </div>

        <div className="p-2">
          <div className="mb-4">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide px-3 py-2">My Linktree</div>
            <nav className="space-y-1">
              <div className="flex items-center px-3 py-2 text-sm rounded-lg bg-gray-100 text-gray-900 font-medium">
                <Link2 className="w-4 h-4 mr-3" />
                Links
              </div>
              <a href="#" className="flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
                <div className="w-4 h-4 mr-3 bg-gray-300 rounded" />
                Shop
              </a>
              <a href="#" className="flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
                <Palette className="w-4 h-4 mr-3" />
                Design
              </a>
            </nav>
          </div>

          <div className="mb-4">
            <div className="flex items-center text-xs font-medium text-gray-500 uppercase tracking-wide px-3 py-2">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2" />
              Earn
              <span className="ml-auto bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">NEW</span>
            </div>
            <nav className="space-y-1">
              <a href="#" className="flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
                <BarChart3 className="w-4 h-4 mr-3" />
                Overview
              </a>
              <a href="#" className="flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg justify-between">
                Earnings
                <span className="text-xs text-gray-400">$0.00</span>
              </a>
            </nav>
          </div>

          <div className="mb-4">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide px-3 py-2">Audience</div>
            <nav className="space-y-1">
              <a href="#" className="flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
                <BarChart3 className="w-4 h-4 mr-3" />
                Insights
              </a>
            </nav>
          </div>

          <div className="mb-4">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide px-3 py-2">Tools</div>
            <nav className="space-y-1">
              <a href="#" className="flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
                <Users className="w-4 h-4 mr-3" />
                Social planner
              </a>
              <a href="#" className="flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
                <Instagram className="w-4 h-4 mr-3" />
                Instagram auto-reply
              </a>
              <a href="#" className="flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
                <Link2 className="w-4 h-4 mr-3" />
                Link shortener
              </a>
              <a href="#" className="flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
                <Search className="w-4 h-4 mr-3" />
                Post ideas
              </a>
            </nav>
          </div>
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <button className="w-full flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
            <Settings className="w-4 h-4 mr-3" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 ml-48 ${showDesignPanel ? 'mr-80' : 'mr-80'}`}>
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <h1 className="text-2xl font-bold text-gray-900">Links</h1>
              <div className="flex space-x-4">
                <button className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Zap className="w-4 h-4" />
                  <span>Enhance</span>
                </button>
                <button 
                  onClick={() => setShowDesignPanel(!showDesignPanel)}
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Palette className="w-4 h-4" />
                  <span>Design</span>
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">linktr.ee/neuromargarethap...</span>
              <ExternalLink className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 max-w-4xl">
          {/* Profile Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8 shadow-sm">
            <div className="flex items-start space-x-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-2xl font-bold text-white">M</span>
                </div>
                <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm">
                  <Camera className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-4">
                  <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
                  <button className="text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors">
                    Editar perfil
                  </button>
                </div>
                
                <p className="text-gray-600 mb-4">{profile.bio}</p>
                
                <div className="flex space-x-4">
                  {[Instagram, 'tiktok', Youtube, 'twitter'].map((Icon, i) => (
                    <button key={i} className="p-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                      {typeof Icon === 'function' ? <Icon className="w-5 h-5 text-gray-400" /> : <div className="w-5 h-5 bg-gray-400 rounded" />}
                    </button>
                  ))}
                  <button className="p-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                    <Plus className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Add Button */}
          <button 
            onClick={() => setShowAddModal(true)}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-full py-4 mb-8 font-medium text-lg transition-colors flex items-center justify-center shadow-sm"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add
          </button>

          {/* Quick Actions */}
          <div className="flex space-x-4 mb-8">
            <button 
              onClick={() => setShowTemplateModal(true)}
              className="flex-1 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-all text-left"
            >
              <Type className="w-5 h-5 text-purple-600 mb-2" />
              <div className="font-medium text-gray-900 mb-1">Escolher Template</div>
              <div className="text-sm text-gray-600">Atual: {templates.find(t => t.id === currentTemplate)?.name}</div>
            </button>
            
            <button 
              onClick={() => setShowDesignPanel(true)}
              className="flex-1 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-all text-left"
            >
              <Palette className="w-5 h-5 text-purple-600 mb-2" />
              <div className="font-medium text-gray-900 mb-1">Personalizar</div>
              <div className="text-sm text-gray-600">Cores, fundos e efeitos</div>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-gray-900">{links.length}</div>
              <div className="text-sm text-gray-600">Links ativos</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-gray-900">{links.reduce((acc, link) => acc + link.clicks, 0)}</div>
              <div className="text-sm text-gray-600">Total de clicks</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-gray-900">Template: {templates.find(t => t.id === currentTemplate)?.name}</div>
              <div className="text-sm text-gray-600">Design atual</div>
            </div>
          </div>

          {/* Links List */}
          <div className="space-y-4">
            {links.map((link) => (
              <div key={link.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-center space-x-3">
                  <GripVertical className="w-5 h-5 text-gray-400 cursor-grab hover:text-gray-600" />
                  
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 text-sm">{link.title}</div>
                    <div className="text-sm text-gray-500 truncate mt-1">{link.url}</div>
                    <div className="text-xs text-gray-400 mt-1">{link.clicks} clicks</div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <ExternalLink className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer" />
                    <Copy className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer" />
                    <Edit className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer" />
                    <button onClick={() => toggleLink(link.id)}>
                      {link.isActive ? 
                        <Eye className="w-4 h-4 text-green-600" /> : 
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      }
                    </button>
                    <button onClick={() => deleteLink(link.id)}>
                      <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-600 cursor-pointer" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Preview */}
      <div className="w-80 fixed right-8 top-8 bottom-8 z-30">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 h-full overflow-hidden">
          <div className="bg-black h-6 rounded-t-3xl flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
          
          <div className={`p-6 h-full flex flex-col items-center overflow-y-auto ${backgrounds.find(bg => bg.id === currentBackground)?.class || 'bg-gradient-to-br from-purple-100 to-pink-100'}`}>
            <div className="w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-gray-600">M</span>
            </div>
            
            <h2 className="text-xl font-bold text-white mb-1 text-center">{profile.name}</h2>
            <p className="text-sm text-white/80 mb-6 text-center px-4">{profile.bio}</p>
            
            <div className="flex space-x-4 mb-8">
              <div className="w-6 h-6 text-white/70" />
              <Instagram className="w-6 h-6 text-white/70" />
            </div>
            
            <div className="w-full space-y-3 px-2">
              {links.slice(0, 4).map((link) => (
                <div 
                  key={link.id} 
                  className={`bg-white/20 backdrop-blur-sm rounded-xl p-4 shadow-sm text-center border border-white/30 ${
                    currentTemplate === 'glassmorphism' ? 'bg-white/10 backdrop-blur-lg' :
                    currentTemplate === 'neon' ? 'bg-gray-900/50 border-cyan-400/50' :
                    currentTemplate === 'minimal' ? 'bg-white shadow-md border-gray-200' :
                    'bg-white/90'
                  }`}
                >
                  <div className={`font-medium text-sm truncate ${
                    currentTemplate === 'minimal' ? 'text-gray-900' : 'text-white'
                  }`}>
                    {link.title}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Design Panel */}
      {showDesignPanel && <DesignPanel />}

      {/* Modals */}
      {showAddModal && <AddLinkModal />}
      {showTemplateModal && <TemplateModal />}
    </div>
  )
}