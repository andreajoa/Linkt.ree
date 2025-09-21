'use client'

import { useState } from 'react'
import { User } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface TemplateSelectorProps {
  user: User & {
    pages: Array<{
      id: string
      title: string
    }>
    links: Array<{
      id: string
      title: string
      url: string
    }>
    socials: Array<{
      id: string
      platform: string
      username: string
    }>
  }
}

export function TemplateSelector({ user }: TemplateSelectorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

  const templates = [
    {
      id: 'glassmorphism',
      name: 'Glassmorphism',
      description: 'Design moderno com efeitos de vidro',
      gradient: 'from-blue-500/20 to-purple-500/20',
      border: 'border-blue-400/30',
      preview: 'bg-gradient-to-br from-blue-100 to-purple-100'
    },
    {
      id: 'neumorphism',
      name: 'Neumorphism',
      description: 'Estilo minimalista com profundidade',
      gradient: 'from-gray-500/20 to-gray-600/20',
      border: 'border-gray-400/30',
      preview: 'bg-gradient-to-br from-gray-100 to-gray-200'
    },
    {
      id: 'cyberpunk',
      name: 'Cyberpunk',
      description: 'Visual futurista e vibrante',
      gradient: 'from-pink-500/20 to-cyan-500/20',
      border: 'border-pink-400/30',
      preview: 'bg-gradient-to-br from-pink-100 to-cyan-100'
    },
    {
      id: 'minimal',
      name: 'Minimalist',
      description: 'Simplicidade e elegância',
      gradient: 'from-white/10 to-gray-500/20',
      border: 'border-white/30',
      preview: 'bg-gradient-to-br from-white to-gray-50'
    },
    {
      id: 'business',
      name: 'Business',
      description: 'Profissional e confiável',
      gradient: 'from-indigo-500/20 to-blue-500/20',
      border: 'border-indigo-400/30',
      preview: 'bg-gradient-to-br from-indigo-100 to-blue-100'
    },
    {
      id: 'creative',
      name: 'Creative',
      description: 'Artístico e expressivo',
      gradient: 'from-orange-500/20 to-red-500/20',
      border: 'border-orange-400/30',
      preview: 'bg-gradient-to-br from-orange-100 to-red-100'
    }
  ]

  const handleTemplateSelect = async (templateId: string) => {
    setSelectedTemplate(templateId)
    
    try {
      const response = await fetch('/api/user/template', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          template: templateId
        })
      })

      if (response.ok) {
        // Template atualizado com sucesso
        console.log('Template atualizado:', templateId)
      }
    } catch (error) {
      console.error('Erro ao atualizar template:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Escolha seu Template</h3>
        <p className="text-gray-600">Selecione um template que combine com seu estilo</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card 
            key={template.id}
            className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
              selectedTemplate === template.id 
                ? 'ring-2 ring-purple-500 shadow-lg' 
                : 'hover:shadow-lg'
            }`}
            onClick={() => handleTemplateSelect(template.id)}
          >
            <CardContent className="p-0">
              <div className={`h-48 ${template.preview} rounded-t-lg flex items-center justify-center relative overflow-hidden`}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                <div className="relative z-10 text-center">
                  <div className="w-16 h-16 bg-white/30 backdrop-blur-sm rounded-xl mx-auto mb-3 flex items-center justify-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg"></div>
                  </div>
                  <div className="space-y-1">
                    <div className="h-2 bg-white/40 rounded-full w-20 mx-auto"></div>
                    <div className="h-2 bg-white/30 rounded-full w-16 mx-auto"></div>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{template.name}</h4>
                  {selectedTemplate === template.id && (
                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                <Button 
                  variant={selectedTemplate === template.id ? "default" : "outline"}
                  className="w-full"
                  onClick={() => handleTemplateSelect(template.id)}
                >
                  {selectedTemplate === template.id ? 'Selecionado' : 'Selecionar'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedTemplate && (
        <div className="text-center">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            onClick={() => {
              // Redirecionar para o editor
              window.location.href = '/admin'
            }}
          >
            Continuar com {templates.find(t => t.id === selectedTemplate)?.name}
          </Button>
        </div>
      )}
    </div>
  )
}
