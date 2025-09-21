'use client'

import { useState } from 'react'
import { User } from '@prisma/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  BarChart3, 
  TrendingUp, 
  Eye, 
  MousePointer, 
  Users, 
  Clock,
  Globe,
  Smartphone,
  Calendar,
  Download
} from 'lucide-react'

interface AnalyticsProps {
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

export function Analytics({ user }: AnalyticsProps) {
  const [timeRange, setTimeRange] = useState('7d')

  const timeRanges = [
    { id: '24h', label: '24 horas' },
    { id: '7d', label: '7 dias' },
    { id: '30d', label: '30 dias' },
    { id: '90d', label: '90 dias' }
  ]

  const analytics = {
    totalViews: 12547,
    totalClicks: 3241,
    conversionRate: 25.8,
    topCountry: 'Brasil',
    topDevice: 'Mobile',
    peakHour: '14:00'
  }

  const topLinks = [
    { title: 'Meu Portfolio', clicks: 890, views: 2340, ctr: 38.0 },
    { title: 'YouTube Channel', clicks: 567, views: 1890, ctr: 30.0 },
    { title: 'LinkedIn', clicks: 423, views: 1567, ctr: 27.0 },
    { title: 'GitHub', clicks: 298, views: 1234, ctr: 24.1 },
    { title: 'Instagram', clicks: 234, views: 987, ctr: 23.7 }
  ]

  const trafficSources = [
    { source: 'Direto', percentage: 45, color: 'bg-blue-500' },
    { source: 'Instagram', percentage: 25, color: 'bg-pink-500' },
    { source: 'Twitter', percentage: 15, color: 'bg-sky-500' },
    { source: 'Outros', percentage: 15, color: 'bg-gray-500' }
  ]

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Analytics</h3>
          <p className="text-sm text-gray-600">Acompanhe o desempenho da sua página</p>
        </div>
        <div className="flex space-x-2">
          {timeRanges.map((range) => (
            <Button
              key={range.id}
              variant={timeRange === range.id ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange(range.id)}
            >
              {range.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Visualizações</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalViews.toLocaleString()}</p>
                <p className="text-sm text-green-600 mt-1">+12% vs período anterior</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Cliques</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalClicks.toLocaleString()}</p>
                <p className="text-sm text-green-600 mt-1">+8% vs período anterior</p>
              </div>
              <div className="p-3 rounded-full bg-green-100">
                <MousePointer className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Taxa de Conversão</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.conversionRate}%</p>
                <p className="text-sm text-green-600 mt-1">+2.3% vs período anterior</p>
              </div>
              <div className="p-3 rounded-full bg-purple-100">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Horário de Pico</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.peakHour}</p>
                <p className="text-sm text-gray-500 mt-1">Horário local</p>
              </div>
              <div className="p-3 rounded-full bg-orange-100">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Links */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>Links Mais Clicados</span>
            </CardTitle>
            <CardDescription>
              Performance dos seus links
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topLinks.map((link, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{link.title}</p>
                      <p className="text-xs text-gray-500">{link.views} visualizações</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{link.clicks} cliques</p>
                    <p className="text-xs text-green-600">{link.ctr}% CTR</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Traffic Sources */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="w-5 h-5" />
              <span>Fontes de Tráfego</span>
            </CardTitle>
            <CardDescription>
              De onde vem seu público
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trafficSources.map((source, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${source.color}`}></div>
                    <span className="text-sm font-medium">{source.source}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${source.color}`}
                        style={{ width: `${source.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-10 text-right">{source.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Device & Location */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Smartphone className="w-5 h-5" />
              <span>Dispositivos</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Smartphone className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">Mobile</span>
                </div>
                <span className="text-sm font-medium">68%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">Desktop</span>
                </div>
                <span className="text-sm font-medium">32%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Localização</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">🇧🇷 Brasil</span>
                <span className="text-sm font-medium">45%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">🇺🇸 Estados Unidos</span>
                <span className="text-sm font-medium">23%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">🇪🇸 Espanha</span>
                <span className="text-sm font-medium">12%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Export Button */}
      <div className="text-center">
        <Button variant="outline" className="mr-4">
          <Calendar className="w-4 h-4 mr-2" />
          Relatório Completo
        </Button>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Exportar Dados
        </Button>
      </div>
    </div>
  )
}
