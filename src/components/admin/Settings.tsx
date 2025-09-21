'use client'

import { useState } from 'react'
import { User } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  User as UserIcon, 
  Palette, 
  Globe, 
  Bell, 
  Shield, 
  CreditCard,
  Save,
  Eye,
  EyeOff,
  Upload
} from 'lucide-react'

interface SettingsProps {
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

export function Settings({ user }: SettingsProps) {
  const [activeTab, setActiveTab] = useState('profile')
  const [showPassword, setShowPassword] = useState(false)

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: UserIcon },
    { id: 'appearance', label: 'Aparência', icon: Palette },
    { id: 'domain', label: 'Domínio', icon: Globe },
    { id: 'notifications', label: 'Notificações', icon: Bell },
    { id: 'security', label: 'Segurança', icon: Shield },
    { id: 'billing', label: 'Faturamento', icon: CreditCard },
  ]

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab(tab.id)}
            className="flex items-center space-x-2"
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </Button>
        ))}
      </div>

      {/* Profile Settings */}
      {activeTab === 'profile' && (
        <Card>
          <CardHeader>
            <CardTitle>Informações do Perfil</CardTitle>
            <CardDescription>
              Gerencie suas informações pessoais
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  {user.image ? (
                    <img 
                      src={user.image} 
                      alt="Avatar" 
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <UserIcon className="w-12 h-12 text-white" />
                  )}
                </div>
                <Button 
                  size="sm" 
                  className="absolute -bottom-2 -right-2"
                  variant="outline"
                >
                  <Upload className="w-4 h-4" />
                </Button>
              </div>
              <div>
                <h3 className="text-lg font-semibold">{user.name || 'Sem nome'}</h3>
                <p className="text-gray-600">{user.email}</p>
                <p className="text-sm text-gray-500">@{user.username || 'username'}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome completo
                </label>
                <input
                  type="text"
                  defaultValue={user.name || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  defaultValue={user.username || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                defaultValue={user.bio || ''}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Conte um pouco sobre você..."
              />
            </div>

            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
              <Save className="w-4 h-4 mr-2" />
              Salvar Alterações
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Appearance Settings */}
      {activeTab === 'appearance' && (
        <Card>
          <CardHeader>
            <CardTitle>Aparência</CardTitle>
            <CardDescription>
              Personalize o visual da sua página
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Template Atual
              </label>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg"></div>
                <div>
                  <p className="font-medium">Glassmorphism</p>
                  <p className="text-sm text-gray-500">Template moderno com efeitos de vidro</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tema
              </label>
              <div className="flex space-x-4">
                <Button variant="outline" className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-white border border-gray-300 rounded"></div>
                  <span>Claro</span>
                </Button>
                <Button variant="outline" className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-900 rounded"></div>
                  <span>Escuro</span>
                </Button>
                <Button className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500">
                  <div className="w-4 h-4 bg-white rounded"></div>
                  <span>Sistema</span>
                </Button>
              </div>
            </div>

            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
              <Save className="w-4 h-4 mr-2" />
              Aplicar Mudanças
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Domain Settings */}
      {activeTab === 'domain' && (
        <Card>
          <CardHeader>
            <CardTitle>Domínio Personalizado</CardTitle>
            <CardDescription>
              Use seu próprio domínio para uma presença profissional
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Domínio Atual
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  defaultValue="meusite.com"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <Button variant="outline">Verificar</Button>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Configure os registros DNS apontando para nossa plataforma
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Como configurar:</h4>
              <ol className="text-sm text-blue-800 space-y-1">
                <li>1. Acesse o painel do seu provedor de domínio</li>
                <li>2. Crie um registro CNAME apontando para linktreepro.com</li>
                <li>3. Aguarde a propagação (até 24h)</li>
                <li>4. Clique em &quot;Verificar&quot; para confirmar</li>
              </ol>
            </div>

            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
              <Save className="w-4 h-4 mr-2" />
              Salvar Domínio
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Security Settings */}
      {activeTab === 'security' && (
        <Card>
          <CardHeader>
            <CardTitle>Segurança</CardTitle>
            <CardDescription>
              Gerencie a segurança da sua conta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nova Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar Nova Senha
              </label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input type="checkbox" id="2fa" className="rounded" />
              <label htmlFor="2fa" className="text-sm font-medium text-gray-700">
                Ativar autenticação de dois fatores (2FA)
              </label>
            </div>

            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
              <Save className="w-4 h-4 mr-2" />
              Atualizar Segurança
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Billing Settings */}
      {activeTab === 'billing' && (
        <Card>
          <CardHeader>
            <CardTitle>Faturamento</CardTitle>
            <CardDescription>
              Gerencie sua assinatura e pagamentos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Plano Atual</h3>
                  <p className="text-purple-600 font-medium">Gratuito</p>
                </div>
                <Button variant="outline" className="border-purple-300 text-purple-600">
                  Upgrade para Pro
                </Button>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-4">Histórico de Pagamentos</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">Plano Pro - Janeiro 2024</p>
                    <p className="text-xs text-gray-500">19 de jan, 2024</p>
                  </div>
                  <span className="text-sm font-medium">R$ 19,90</span>
                </div>
              </div>
            </div>

            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
              <CreditCard className="w-4 h-4 mr-2" />
              Gerenciar Pagamentos
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
