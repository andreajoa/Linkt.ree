'use client'

import { useState } from 'react'
import { User } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Plus, 
  Link as LinkIcon, 
  Instagram, 
  Youtube, 
  Twitter,
  Github,
  Linkedin,
  ExternalLink,
  Edit,
  Trash2,
  GripVertical
} from 'lucide-react'

interface PageEditorProps {
  user: User & {
    pages: any[]
    links: any[]
    socials: any[]
  }
}

export function PageEditor({ user }: PageEditorProps) {
  const [links, setLinks] = useState(user.links || [])
  const [socials, setSocials] = useState(user.socials || [])

  const socialPlatforms = [
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
    { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'bg-red-500' },
    { id: 'twitter', name: 'Twitter', icon: Twitter, color: 'bg-blue-400' },
    { id: 'github', name: 'GitHub', icon: Github, color: 'bg-gray-800' },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'bg-blue-600' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Editor de Links</h3>
          <p className="text-sm text-gray-600">Gerencie seus links e redes sociais</p>
        </div>
        <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Link
        </Button>
      </div>

      {/* Links Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <LinkIcon className="w-5 h-5" />
            <span>Meus Links</span>
          </CardTitle>
          <CardDescription>
            Adicione e organize seus links importantes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {links.length === 0 ? (
            <div className="text-center py-12">
              <LinkIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">Nenhum link adicionado</h4>
              <p className="text-gray-600 mb-4">Comece adicionando seu primeiro link</p>
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Primeiro Link
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {links.map((link: any, index: number) => (
                <div key={index} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900">{link.title}</h4>
                      <ExternalLink className="w-3 h-3 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-600">{link.url}</p>
                    {link.description && (
                      <p className="text-xs text-gray-500 mt-1">{link.description}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Social Media Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Instagram className="w-5 h-5" />
            <span>Redes Sociais</span>
          </CardTitle>
          <CardDescription>
            Conecte suas redes sociais
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {socialPlatforms.map((platform) => {
              const social = socials.find((s: any) => s.platform === platform.id)
              return (
                <div
                  key={platform.id}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    social 
                      ? 'border-purple-200 bg-purple-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <div className={`w-12 h-12 rounded-full ${platform.color} flex items-center justify-center`}>
                      <platform.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {platform.name}
                    </span>
                    {social ? (
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-green-600">Conectado</span>
                      </div>
                    ) : (
                      <Button variant="ghost" size="sm" className="text-xs">
                        Conectar
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Preview Section */}
      <Card>
        <CardHeader>
          <CardTitle>Preview da Página</CardTitle>
          <CardDescription>
            Veja como sua página está ficando
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-100 rounded-lg p-8 min-h-[400px] flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {user.name || 'Seu Nome'}
              </h3>
              <p className="text-gray-600 mb-6">
                {user.bio || 'Sua bio aparecerá aqui'}
              </p>
              
              {links.length > 0 && (
                <div className="space-y-2 max-w-sm mx-auto">
                  {links.slice(0, 3).map((link: any, index: number) => (
                    <div key={index} className="bg-white rounded-lg p-3 shadow-sm">
                      <span className="text-sm font-medium">{link.title}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
