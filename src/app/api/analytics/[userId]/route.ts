import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getPageAnalyticsSummary } from '@/lib/advanced-analytics'

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    // Verificar se o usuário está autenticado e é o dono dos dados
    if (!session || session.user.id !== params.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '30')
    const type = searchParams.get('type') || 'summary'

    let data

    switch (type) {
      case 'summary':
        data = await LinkTreeAnalytics.getUserAnalyticsSummary(params.userId, days)
        break
      case 'country':
        data = await LinkTreeAnalytics.getCountryStats(params.userId, days)
        break
      case 'device':
        data = await LinkTreeAnalytics.getDeviceStats(params.userId, days)
        break
      default:
        return NextResponse.json({ error: 'Invalid analytics type' }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      data,
      period: `${days} days`
    })

  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
