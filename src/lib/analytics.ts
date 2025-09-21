import { prisma } from './prisma'
import { UAParser } from 'ua-parser-js'

export interface ClickMetadata {
  ip?: string
  userAgent?: string
  referrer?: string
  country?: string
}

export class LinkTreeAnalytics {
  // Rastrear clique em link
  static async trackLinkClick(
    linkId: string,
    userId: string,
    metadata: ClickMetadata
  ) {
    try {
      // Parse do user agent
      const parser = new UAParser(metadata.userAgent)
      const device = parser.getDevice()
      const browser = parser.getBrowser()
      const os = parser.getOS()

      // Salvar no banco
      await prisma.linkClick.create({
        data: {
          linkId,
          userId,
          ip: metadata.ip,
          userAgent: metadata.userAgent,
          referrer: metadata.referrer,
          country: metadata.country,
          device: device.model || device.type || 'Unknown',
          browser: `${browser.name} ${browser.version}`,
          os: `${os.name} ${os.version}`,
        }
      })

      // Atualizar contador do link
      await prisma.link.update({
        where: { id: linkId },
        data: {
          clicks: {
            increment: 1
          }
        }
      })

      console.log(`Link click tracked: ${linkId}`)
    } catch (error) {
      console.error('Analytics tracking error:', error)
    }
  }

  // Obter estatísticas de um link
  static async getLinkStats(linkId: string, days = 30) {
    try {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      const stats = await prisma.linkClick.groupBy({
        by: ['timestamp'],
        where: {
          linkId,
          timestamp: {
            gte: startDate
          }
        },
        _count: {
          id: true
        }
      })

      return stats.map(stat => ({
        date: stat.timestamp.toISOString().split('T')[0],
        clicks: stat._count.id
      }))
    } catch (error) {
      console.error('Analytics stats error:', error)
      return []
    }
  }

  // Obter estatísticas por país
  static async getCountryStats(userId: string, days = 30) {
    try {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      const stats = await prisma.linkClick.groupBy({
        by: ['country'],
        where: {
          userId,
          timestamp: {
            gte: startDate
          },
          country: {
            not: null
          }
        },
        _count: {
          id: true
        },
        orderBy: {
          _count: {
            id: 'desc'
          }
        }
      })

      return stats.map(stat => ({
        country: stat.country,
        clicks: stat._count.id
      }))
    } catch (error) {
      console.error('Country stats error:', error)
      return []
    }
  }

  // Obter estatísticas por dispositivo
  static async getDeviceStats(userId: string, days = 30) {
    try {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      const stats = await prisma.linkClick.groupBy({
        by: ['device'],
        where: {
          userId,
          timestamp: {
            gte: startDate
          },
          device: {
            not: null
          }
        },
        _count: {
          id: true
        },
        orderBy: {
          _count: {
            id: 'desc'
          }
        }
      })

      return stats.map(stat => ({
        device: stat.device,
        clicks: stat._count.id
      }))
    } catch (error) {
      console.error('Device stats error:', error)
      return []
    }
  }

  // Obter resumo geral de analytics
  static async getUserAnalyticsSummary(userId: string, days = 30) {
    try {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      const totalClicks = await prisma.linkClick.count({
        where: {
          userId,
          timestamp: {
            gte: startDate
          }
        }
      })

      const uniqueVisitors = await prisma.linkClick.groupBy({
        by: ['ip'],
        where: {
          userId,
          timestamp: {
            gte: startDate
          }
        }
      })

      const topLinks = await prisma.link.findMany({
        where: {
          userId,
          analytics: {
            some: {
              timestamp: {
                gte: startDate
              }
            }
          }
        },
        include: {
          _count: {
            select: {
              analytics: {
                where: {
                  timestamp: {
                    gte: startDate
                  }
                }
              }
            }
          }
        },
        orderBy: {
          clicks: 'desc'
        },
        take: 5
      })

      return {
        totalClicks,
        uniqueVisitors: uniqueVisitors.length,
        topLinks: topLinks.map(link => ({
          id: link.id,
          title: link.title,
          clicks: link._count.analytics
        }))
      }
    } catch (error) {
      console.error('Analytics summary error:', error)
      return {
        totalClicks: 0,
        uniqueVisitors: 0,
        topLinks: []
      }
    }
  }
}

