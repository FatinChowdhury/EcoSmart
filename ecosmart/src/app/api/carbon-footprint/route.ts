import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/db'
import { startOfMonth, endOfMonth, subMonths, format } from 'date-fns'

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '6months' // 7days, 30days, 3months, 6months, 1year

    let startDate: Date
    let endDate = new Date()

    switch (period) {
      case '7days':
        startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case '30days':
        startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case '3months':
        startDate = subMonths(endDate, 3)
        break
      case '6months':
        startDate = subMonths(endDate, 6)
        break
      case '1year':
        startDate = subMonths(endDate, 12)
        break
      default:
        startDate = subMonths(endDate, 6)
    }

    // Get carbon footprint data
    const footprints = await prisma.carbonFootprint.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: { date: 'asc' }
    })

    // Get current month's data for summary
    const currentMonthStart = startOfMonth(new Date())
    const currentMonthEnd = endOfMonth(new Date())
    
    const currentMonthFootprints = await prisma.carbonFootprint.findMany({
      where: {
        userId,
        date: {
          gte: currentMonthStart,
          lte: currentMonthEnd
        }
      }
    })

    // Calculate current month totals
    const currentMonthTotal = currentMonthFootprints.reduce((sum, fp) => sum + fp.total, 0)
    const currentMonthByCategory = {
      transport: currentMonthFootprints.reduce((sum, fp) => sum + fp.transport, 0),
      food: currentMonthFootprints.reduce((sum, fp) => sum + fp.food, 0),
      energy: currentMonthFootprints.reduce((sum, fp) => sum + fp.energy, 0),
      shopping: currentMonthFootprints.reduce((sum, fp) => sum + fp.shopping, 0),
      other: currentMonthFootprints.reduce((sum, fp) => sum + fp.other, 0)
    }

    // Get previous month for comparison
    const prevMonthStart = startOfMonth(subMonths(new Date(), 1))
    const prevMonthEnd = endOfMonth(subMonths(new Date(), 1))
    
    const prevMonthFootprints = await prisma.carbonFootprint.findMany({
      where: {
        userId,
        date: {
          gte: prevMonthStart,
          lte: prevMonthEnd
        }
      }
    })

    const prevMonthTotal = prevMonthFootprints.reduce((sum, fp) => sum + fp.total, 0)
    
    // Calculate trend
    let trend: 'up' | 'down' | 'stable' = 'stable'
    let changePercentage = 0

    if (prevMonthTotal > 0) {
      changePercentage = ((currentMonthTotal - prevMonthTotal) / prevMonthTotal) * 100
      if (changePercentage > 5) trend = 'up'
      else if (changePercentage < -5) trend = 'down'
    }

    // Format data for charts
    const chartData = footprints.map(fp => ({
      date: format(fp.date, 'MMM dd'),
      total: fp.total,
      transport: fp.transport,
      food: fp.food,
      energy: fp.energy,
      shopping: fp.shopping,
      other: fp.other
    }))

    // Generate recommendations based on highest category
    const highestCategory = Object.entries(currentMonthByCategory)
      .sort(([,a], [,b]) => b - a)[0]

    const recommendations = getRecommendations(highestCategory[0], highestCategory[1])

    return NextResponse.json({
      success: true,
      data: {
        chartData,
        summary: {
          currentMonth: {
            total: currentMonthTotal,
            byCategory: currentMonthByCategory
          },
          previousMonth: {
            total: prevMonthTotal
          },
          trend,
          changePercentage: Math.abs(changePercentage),
          recommendations
        }
      }
    })

  } catch (error) {
    console.error('Get carbon footprint error:', error)
    return NextResponse.json(
      { error: 'Failed to get carbon footprint data' },
      { status: 500 }
    )
  }
}

function getRecommendations(category: string, amount: number): string[] {
  const recommendations: Record<string, string[]> = {
    transport: [
      'Consider using public transportation or carpooling',
      'Try biking or walking for short distances',
      'Look into electric or hybrid vehicles',
      'Work from home when possible to reduce commuting'
    ],
    food: [
      'Reduce meat consumption and try plant-based alternatives',
      'Buy local and seasonal produce',
      'Minimize food waste by meal planning',
      'Choose organic options when available'
    ],
    energy: [
      'Switch to LED light bulbs',
      'Unplug electronics when not in use',
      'Use a programmable thermostat',
      'Consider renewable energy sources'
    ],
    shopping: [
      'Buy only what you need',
      'Choose products with minimal packaging',
      'Look for eco-friendly and sustainable brands',
      'Consider buying second-hand items'
    ],
    other: [
      'Reduce, reuse, and recycle',
      'Choose digital receipts and bills',
      'Use reusable bags and containers',
      'Support environmentally conscious businesses'
    ]
  }

  return recommendations[category] || recommendations.other
} 