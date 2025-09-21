import { Suspense } from 'react'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Dashboard } from '@/components/admin/Dashboard'
import { PageEditor } from '@/components/admin/PageEditor'
import { TemplateSelector } from '@/components/admin/TemplateSelector'
import { Analytics } from '@/components/admin/Analytics'
import { Settings } from '@/components/admin/Settings'
import { Button } from '@/components/ui/button'
import { 
  LayoutDashboard, 
  Edit3, 
  Palette, 
  BarChart3, 
  Settings as SettingsIcon,
  Plus,
  ExternalLink,
  User
} from 'lucide-react'

export default async function AdminPage() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      redirect('/api/auth/signin')
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        pages: {
          include: {
            blocks: true
          }
        },
        links: true,
        socials: true,
      },
    })

    if (!user) {
      redirect('/api/auth/signin')
    }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Olá, {user.name || 'Criador'}! 👋
                </h1>
                <p className="text-sm text-gray-500">
                  Gerencie sua presença digital
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                Ver Página
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                <Plus className="w-4 h-4 mr-2" />
                Novo Link
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {user.pages && user.pages.length > 0 ? (
          <Dashboard user={user} />
        ) : (
          <div className="text-center py-20">
            <div className="max-w-2xl mx-auto">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <Plus className="w-12 h-12 text-purple-500" />
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Crie sua primeira página
              </h2>
              
              <p className="text-lg text-gray-600 mb-8">
                Escolha um template incrível e comece a compartilhar seus links de forma elegante
              </p>
              
              <TemplateSelector user={user} />
            </div>
          </div>
        )}
      </main>
    </div>
  )
  } catch (error) {
    console.error('Error in AdminPage:', error)
    redirect('/api/auth/signin')
  }
}
