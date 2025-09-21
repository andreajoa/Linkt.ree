'use client'

import { useState } from 'react'
import { User } from '@prisma/client'
import { PageEditor } from './PageEditor'
import { TemplateSelector } from './TemplateSelector'
import { Analytics } from './Analytics'
import { Settings } from './Settings'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  LayoutDashboard, 
  Edit3, 
  Palette, 
  BarChart3, 
  Settings as SettingsIcon,
  Eye,
  Link as LinkIcon,
  TrendingUp,
  Users,
  MousePointer
} from 'lucide-react'

interface DashboardProps {
  user: User & {
    pages: Array<{
      id: string
      title: string
      blocks: Array<{
        id: string
        title: string
        type: string
        clicks: number
      }>
    }>
    links: Array<{
      id: string
      title: string
      url: string
      description?: string
      clicks: number
    }>
    socials: Array<{
      id: string
      platform: string
      username: string
      url: string
    }>
  }
}

export function Dashboard({ user }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('overview')

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: LayoutDashboard },
    { id: 'editor', label: 'Editor', icon: Edit3 },
    { id: 'templates', label: 'Templates', icon: Palette },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Configurações', icon: SettingsIcon },
  ]

  const stats = [
    {
      title: 'Visualizações',
      value: '12.5K',
      change: '+12%',
      icon: Eye,
      color: 'text-blue-600'
    },
    {
      title: 'Cliques',
      value: '3.2K',
      change: '+8%',
      icon: MousePointer,
      color: 'text-green-600'
    },
    {
      title: 'Taxa de Conversão',
      value: '25.6%',
      change: '+5%',
      icon: TrendingUp,
      color: 'text-purple-600'
    },
    {
      title: 'Links Ativos',
      value: user.links?.length || 0,
      change: '+2',
      icon: LinkIcon,
      color: 'text-orange-600'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  <p className="text-sm text-green-600 mt-1">
                    {stat.change}
                  </p>
                </div>
                <div className={`p-3 rounded-full bg-gray-100 ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <LinkIcon className="w-5 h-5" />
                      <span>Links Recentes</span>
                    </CardTitle>
                    <CardDescription>
                      Seus links mais acessados
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {user.links?.slice(0, 5).map((link, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <div>
                              <p className="font-medium text-sm">{link.title}</p>
                              <p className="text-xs text-gray-500">{link.url}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{link.clicks || 0}</p>
                            <p className="text-xs text-gray-500">cliques</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="w-5 h-5" />
                      <span>Atividade Recente</span>
                    </CardTitle>
                    <CardDescription>
                      Últimas interações com sua página
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div>
                          <p className="font-medium text-sm">Nova visualização</p>
                          <p className="text-xs text-gray-500">há 2 minutos</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div>
                          <p className="font-medium text-sm">Link clicado</p>
                          <p className="text-xs text-gray-500">há 5 minutos</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <div>
                          <p className="font-medium text-sm">Novo seguidor</p>
                          <p className="text-xs text-gray-500">há 1 hora</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'editor' && <PageEditor user={user} />}
          {activeTab === 'templates' && <TemplateSelector user={user} />}
          {activeTab === 'analytics' && <Analytics user={user} />}
          {activeTab === 'settings' && <Settings user={user} />}
        </div>
      </div>
    </div>
  )
}
