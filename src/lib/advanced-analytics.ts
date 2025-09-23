import { prisma } from './prisma'
import { UAParser } from 'ua-parser-js'

export interface AnalyticsFilters {
  startDate?: Date
  endDate?: Date
  country?: string
  device?: string
  referrer?: string
}

export interface ConversionFunnel {
  steps: Array<{
    name: string
    users: number
    conversionRate: number
    dropOffRate: number
  }>
  totalUsers: number
  overallConversion: number
}

export interface CohortData {
  cohortPeriod: string
  userCount: number
  retentionRates: number[] // [week1, week2, week3, week4]
}

export interface HeatmapData {
  blockId: string
  x: number
  y: number
  clicks: number
  intensity: number
}

export interface ABTestResult {
  variant: string
  visitors: number
  conversions: number
  conversionRate: number
  confidence: number
  isWinner: boolean
}

export class AdvancedAnalytics {
  // Real-time analytics
  static async getRealTimeStats(pageId: string) {
    try {
      const now = new Date()
      const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000)

      const [activeVisitors, recentClicks, topBlocks] = await Promise.all([
        // Active visitors (last 5 minutes)
        prisma.pageView.count({
          where: {
            pageId,
            timestamp: { gte: fiveMinutesAgo }
          }
        }),

        // Recent clicks
        prisma.blockClick.count({
          where: {
            pageId,
            timestamp: { gte: fiveMinutesAgo }
          }
        }),

        // Top performing blocks (last hour)
        prisma.blockClick.groupBy({
          by: ['blockId'],
          where: {
            pageId,
            timestamp: { gte: new Date(now.getTime() - 60 * 60 * 1000) }
          },
          _count: { blockId: true },
          orderBy: { _count: { blockId: 'desc' } },
          take: 5
        })
      ])

      return {
        activeVisitors,
        recentClicks,
        topBlocks: topBlocks.map(block => ({
          blockId: block.blockId,
          clicks: block._count.blockId
        }))
      }
    } catch (error) {
      console.error('Real-time analytics error:', error)
      return {
        activeVisitors: 0,
        recentClicks: 0,
        topBlocks: []
      }
    }
  }

  // Conversion funnel analysis
  static async getConversionFunnel(
    pageId: string, 
    filters: AnalyticsFilters = {}
  ): Promise<ConversionFunnel> {
    try {
      const { startDate, endDate } = filters
      const dateFilter = {
        ...(startDate && { gte: startDate }),
        ...(endDate && { lte: endDate })
      }

      // Step 1: Page views
      const pageViews = await prisma.pageView.count({
        where: {
          pageId,
          timestamp: dateFilter
        }
      })

      // Step 2: Any block interaction
      const blockInteractions = await prisma.blockClick.count({
        where: {
          pageId,
          timestamp: dateFilter
        }
      })

      // Step 3: Multiple interactions (engaged users)
      const engagedUsers = await prisma.blockClick.groupBy({
        by: ['sessionId'],
        where: {
          pageId,
          timestamp: dateFilter,
          sessionId: { not: null }
        },
        having: {
          sessionId: { _count: { gt: 1 } }
        }
      })

      // Step 4: Conversions (depends on your conversion definition)
      // For now, let's use users who clicked 3+ times as "converted"
      const conversions = await prisma.blockClick.groupBy({
        by: ['sessionId'],
        where: {
          pageId,
          timestamp: dateFilter,
          sessionId: { not: null }
        },
        having: {
          sessionId: { _count: { gte: 3 } }
        }
      })

      const steps = [
        {
          name: 'Page Views',
          users: pageViews,
          conversionRate: 100,
          dropOffRate: 0
        },
        {
          name: 'First Interaction',
          users: blockInteractions,
          conversionRate: pageViews ? (blockInteractions / pageViews) * 100 : 0,
          dropOffRate: pageViews ? ((pageViews - blockInteractions) / pageViews) * 100 : 0
        },
        {
          name: 'Engaged Users',
          users: engagedUsers.length,
          conversionRate: blockInteractions ? (engagedUsers.length / blockInteractions) * 100 : 0,
          dropOffRate: blockInteractions ? ((blockInteractions - engagedUsers.length) / blockInteractions) * 100 : 0
        },
        {
          name: 'Conversions',
          users: conversions.length,
          conversionRate: engagedUsers.length ? (conversions.length / engagedUsers.length) * 100 : 0,
          dropOffRate: engagedUsers.length ? ((engagedUsers.length - conversions.length) / engagedUsers.length) * 100 : 0
        }
      ]

      return {
        steps,
        totalUsers: pageViews,
        overallConversion: pageViews ? (conversions.length / pageViews) * 100 : 0
      }
    } catch (error) {
      console.error('Conversion funnel error:', error)
      return {
        steps: [],
        totalUsers: 0,
        overallConversion: 0
      }
    }
  }

  // Cohort analysis
  static async getCohortAnalysis(
    pageId: string,
    periodType: 'week' | 'month' = 'week'
  ): Promise<CohortData[]> {
    try {
      // This is a simplified cohort analysis
      // In a real implementation, you'd want more sophisticated cohort tracking
      
      const cohorts = await prisma.$queryRaw`
        WITH cohorts AS (
          SELECT 
            DATE_TRUNC(${periodType}, timestamp) as cohort_period,
            session_id,
            MIN(timestamp) as first_visit
          FROM "PageView"
          WHERE page_id = ${pageId}
            AND session_id IS NOT NULL
          GROUP BY DATE_TRUNC(${periodType}, timestamp), session_id
        ),
        cohort_sizes AS (
          SELECT 
            cohort_period,
            COUNT(DISTINCT session_id) as user_count
          FROM cohorts
          GROUP BY cohort_period
        ),
        retention AS (
          SELECT 
            c.cohort_period,
            COUNT(DISTINCT pv.session_id) as retained_users,
            EXTRACT(${periodType} FROM pv.timestamp - c.first_visit) as period_number
          FROM cohorts c
          JOIN "PageView" pv ON c.session_id = pv.session_id
          WHERE pv.page_id = ${pageId}
          GROUP BY c.cohort_period, period_number
        )
        SELECT 
          cs.cohort_period::text,
          cs.user_count,
          COALESCE(
            ARRAY_AGG(
              CASE 
                WHEN r.period_number BETWEEN 1 AND 4 
                THEN (r.retained_users::float / cs.user_count * 100)::int
                ELSE NULL 
              END
              ORDER BY r.period_number
            ) FILTER (WHERE r.period_number IS NOT NULL), 
            ARRAY[]::int[]
          ) as retention_rates
        FROM cohort_sizes cs
        LEFT JOIN retention r ON cs.cohort_period = r.cohort_period
        GROUP BY cs.cohort_period, cs.user_count
        ORDER BY cs.cohort_period DESC
        LIMIT 12
      ` as any[]

      return cohorts.map(cohort => ({
        cohortPeriod: cohort.cohort_period,
        userCount: parseInt(cohort.user_count),
        retentionRates: cohort.retention_rates || []
      }))
    } catch (error) {
      console.error('Cohort analysis error:', error)
      return []
    }
  }

  // Heatmap data generation
  static async getHeatmapData(pageId: string, filters: AnalyticsFilters = {}): Promise<HeatmapData[]> {
    try {
      const { startDate, endDate } = filters
      const dateFilter = {
        ...(startDate && { gte: startDate }),
        ...(endDate && { lte: endDate })
      }

      const clickData = await prisma.blockClick.groupBy({
        by: ['blockId'],
        where: {
          pageId,
          timestamp: dateFilter
        },
        _count: { blockId: true },
        orderBy: { _count: { blockId: 'desc' } }
      })

      // Get block positions (you'd need to store these in your block data)
      const blocks = await prisma.block.findMany({
        where: { pageId },
        select: { id: true, position: true }
      })

      const maxClicks = Math.max(...clickData.map(d => d._count.blockId), 1)

      return clickData.map(data => {
        const block = blocks.find(b => b.id === data.blockId)
        return {
          blockId: data.blockId,
          x: 50, // You'd calculate actual positions based on layout
          y: (block?.position || 0) * 100 + 50, // Simplified positioning
          clicks: data._count.blockId,
          intensity: (data._count.blockId / maxClicks) * 100
        }
      })
    } catch (error) {
      console.error('Heatmap data error:', error)
      return []
    }
  }

  // A/B Testing results
  static async getABTestResults(testId: string): Promise<ABTestResult[]> {
    try {
      const abTest = await prisma.aBTest.findUnique({
        where: { id: testId }
      })

      if (!abTest || !abTest.variants || !abTest.metrics) {
        return []
      }

      const variants = abTest.variants as any[]
      const metrics = abTest.metrics as any

      return variants.map(variant => {
        const variantMetrics = metrics[variant.id] || { visitors: 0, conversions: 0 }
        const conversionRate = variantMetrics.visitors > 0 
          ? (variantMetrics.conversions / variantMetrics.visitors) * 100 
          : 0

        return {
          variant: variant.name,
          visitors: variantMetrics.visitors,
          conversions: variantMetrics.conversions,
          conversionRate,
          confidence: this.calculateStatisticalSignificance(
            variantMetrics.visitors,
            variantMetrics.conversions,
            variants
          ),
          isWinner: variant.id === abTest.winner
        }
      })
    } catch (error) {
      console.error('A/B test results error:', error)
      return []
    }
  }

  // Geographic analytics
  static async getGeographicData(pageId: string, filters: AnalyticsFilters = {}) {
    try {
      const { startDate, endDate } = filters
      const dateFilter = {
        ...(startDate && { gte: startDate }),
        ...(endDate && { lte: endDate })
      }

      const [countryData, cityData] = await Promise.all([
        prisma.pageView.groupBy({
          by: ['country'],
          where: {
            pageId,
            timestamp: dateFilter,
            country: { not: null }
          },
          _count: { country: true },
          orderBy: { _count: { country: 'desc' } },
          take: 20
        }),

        prisma.pageView.groupBy({
          by: ['city', 'country'],
          where: {
            pageId,
            timestamp: dateFilter,
            city: { not: null },
            country: { not: null }
          },
          _count: { city: true },
          orderBy: { _count: { city: 'desc' } },
          take: 10
        })
      ])

      return {
        countries: countryData.map(item => ({
          country: item.country,
          visitors: item._count.country
        })),
        cities: cityData.map(item => ({
          city: item.city,
          country: item.country,
          visitors: item._count.city
        }))
      }
    } catch (error) {
      console.error('Geographic analytics error:', error)
      return { countries: [], cities: [] }
    }
  }

  // Device and browser analytics
  static async getDeviceAnalytics(pageId: string, filters: AnalyticsFilters = {}) {
    try {
      const { startDate, endDate } = filters
      const dateFilter = {
        ...(startDate && { gte: startDate }),
        ...(endDate && { lte: endDate })
      }

      const [deviceData, browserData, osData] = await Promise.all([
        prisma.pageView.groupBy({
          by: ['device'],
          where: {
            pageId,
            timestamp: dateFilter,
            device: { not: null }
          },
          _count: { device: true },
          orderBy: { _count: { device: 'desc' } }
        }),

        prisma.pageView.groupBy({
          by: ['browser'],
          where: {
            pageId,
            timestamp: dateFilter,
            browser: { not: null }
          },
          _count: { browser: true },
          orderBy: { _count: { browser: 'desc' } },
          take: 10
        }),

        prisma.pageView.groupBy({
          by: ['os'],
          where: {
            pageId,
            timestamp: dateFilter,
            os: { not: null }
          },
          _count: { os: true },
          orderBy: { _count: { os: 'desc' } },
          take: 10
        })
      ])

      return {
        devices: deviceData.map(item => ({
          device: item.device,
          visitors: item._count.device
        })),
        browsers: browserData.map(item => ({
          browser: item.browser,
          visitors: item._count.browser
        })),
        operatingSystems: osData.map(item => ({
          os: item.os,
          visitors: item._count.os
        }))
      }
    } catch (error) {
      console.error('Device analytics error:', error)
      return { devices: [], browsers: [], operatingSystems: [] }
    }
  }

  // Performance metrics
  static async getPerformanceMetrics(pageId: string, filters: AnalyticsFilters = {}) {
    try {
      const { startDate, endDate } = filters
      const dateFilter = {
        ...(startDate && { gte: startDate }),
        ...(endDate && { lte: endDate })
      }

      const [avgDuration, bounceRate, topReferrers] = await Promise.all([
        // Average session duration
        prisma.pageView.aggregate({
          where: {
            pageId,
            timestamp: dateFilter,
            duration: { not: null }
          },
          _avg: { duration: true }
        }),

        // Bounce rate (sessions with only 1 page view)
        prisma.$queryRaw`
          SELECT 
            COUNT(CASE WHEN page_count = 1 THEN 1 END)::float / COUNT(*)::float * 100 as bounce_rate
          FROM (
            SELECT session_id, COUNT(*) as page_count
            FROM "PageView"
            WHERE page_id = ${pageId}
              ${startDate ? `AND timestamp >= ${startDate}` : ''}
              ${endDate ? `AND timestamp <= ${endDate}` : ''}
              AND session_id IS NOT NULL
            GROUP BY session_id
          ) session_stats
        ` as any[],

        // Top referrers
        prisma.pageView.groupBy({
          by: ['referrer'],
          where: {
            pageId,
            timestamp: dateFilter,
            referrer: { not: null }
          },
          _count: { referrer: true },
          orderBy: { _count: { referrer: 'desc' } },
          take: 10
        })
      ])

      return {
        averageDuration: Math.round(avgDuration._avg.duration || 0),
        bounceRate: bounceRate[0]?.bounce_rate || 0,
        topReferrers: topReferrers.map(item => ({
          referrer: item.referrer,
          visitors: item._count.referrer
        }))
      }
    } catch (error) {
      console.error('Performance metrics error:', error)
      return {
        averageDuration: 0,
        bounceRate: 0,
        topReferrers: []
      }
    }
  }

  // Helper method for statistical significance
  private static calculateStatisticalSignificance(
    visitors: number, 
    conversions: number, 
    allVariants: any[]
  ): number {
    // Simplified statistical significance calculation
    // In production, you'd want a more sophisticated approach
    if (visitors < 100) return 0 // Not enough data
    
    const conversionRate = conversions / visitors
    const standardError = Math.sqrt((conversionRate * (1 - conversionRate)) / visitors)
    
    // Compare against other variants (simplified)
    const otherVariants = allVariants.filter(v => v.visitors > 0)
    if (otherVariants.length < 2) return 0
    
    // Mock confidence calculation (you'd use proper statistical tests)
    return Math.min(95, Math.max(0, (visitors - 100) / 10))
  }

  // Track page view with enhanced data
  static async trackPageView(
    pageId: string,
    request: Request,
    sessionId?: string
  ) {
    try {
      const userAgent = request.headers.get('user-agent') || ''
      const referrer = request.headers.get('referer') || ''
      const ip = request.headers.get('x-forwarded-for') || 
                 request.headers.get('x-real-ip') || 
                 'unknown'

      // Parse user agent
      const parser = new UAParser(userAgent)
      const device = parser.getDevice()
      const browser = parser.getBrowser()
      const os = parser.getOS()

      // Get geographic data (you'd integrate with a geo IP service)
      const geoData = await this.getGeoData(ip)

      await prisma.pageView.create({
        data: {
          pageId,
          ip,
          userAgent,
          referrer,
          country: geoData.country,
          city: geoData.city,
          device: device.model || device.type || 'Unknown',
          browser: `${browser.name} ${browser.version}`,
          os: `${os.name} ${os.version}`,
          sessionId
        }
      })
    } catch (error) {
      console.error('Page view tracking error:', error)
    }
  }

  // Helper method for geo data (mock implementation)
  private static async getGeoData(ip: string) {
    // In production, integrate with a service like MaxMind or IP-API
    return {
      country: 'US',
      city: 'New York'
    }
  }
}



