import { NextRequest, NextResponse } from 'next/server'
import { LinkTreeAnalytics } from '@/lib/analytics'
import { CacheManager } from '@/lib/cache'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { linkId } = await request.json()

    if (!linkId) {
      return NextResponse.json({ error: 'Link ID required' }, { status: 400 })
    }

    // Rate limiting
    const ip = request.ip || 'unknown'
    const rateLimitKey = `click:${ip}:${linkId}`
    const isAllowed = await CacheManager.checkRateLimit(rateLimitKey, 10, 60) // 10 cliques por minuto

    if (!isAllowed) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
    }

    // Buscar informações do link
    const link = await prisma.link.findUnique({
      where: { id: linkId },
      include: { user: true }
    })

    if (!link) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 })
    }

    // Metadados do clique
    const metadata = {
      ip,
      userAgent: request.headers.get('user-agent') || undefined,
      referrer: request.headers.get('referer') || undefined,
      country: request.geo?.country || undefined,
    }

    // Rastrear o clique
    await LinkTreeAnalytics.trackLinkClick(linkId, link.userId, metadata)

    // Invalidar cache do usuário
    await CacheManager.invalidateUserCache(link.userId)

    return NextResponse.json({ 
      success: true, 
      url: link.url,
      message: 'Click tracked successfully' 
    })

  } catch (error) {
    console.error('Click tracking error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

