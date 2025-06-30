import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { amount, description, category, subcategory, carbonImpact, items } = body

    // Validate required fields
    if (!amount || !description || !category || carbonImpact === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create or update user in database
    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        email: '', // Will be updated when we have user data
        name: '',
      }
    })

    // Save purchase to database
    const purchase = await prisma.purchase.create({
      data: {
        userId,
        amount: parseFloat(amount),
        description,
        category,
        subcategory: subcategory || null,
        carbonImpact: parseFloat(carbonImpact),
        date: new Date(),
      }
    })

    // Update user's carbon footprint
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const existingFootprint = await prisma.carbonFootprint.findFirst({
      where: {
        userId,
        date: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
        }
      }
    })

    if (existingFootprint) {
      // Update existing footprint
      const categoryField = category === 'food' ? 'food' :
                           category === 'transport' ? 'transport' :
                           category === 'energy' ? 'energy' :
                           category === 'shopping' ? 'shopping' : 'other'

      await prisma.carbonFootprint.update({
        where: { id: existingFootprint.id },
        data: {
          [categoryField]: existingFootprint[categoryField as keyof typeof existingFootprint] as number + carbonImpact,
          total: existingFootprint.total + carbonImpact
        }
      })
    } else {
      // Create new footprint entry
      const footprintData: any = {
        userId,
        date: today,
        transport: 0,
        food: 0,
        energy: 0,
        shopping: 0,
        other: 0,
        total: carbonImpact
      }

      const categoryField = category === 'food' ? 'food' :
                           category === 'transport' ? 'transport' :
                           category === 'energy' ? 'energy' :
                           category === 'shopping' ? 'shopping' : 'other'

      footprintData[categoryField] = carbonImpact

      await prisma.carbonFootprint.create({
        data: footprintData
      })
    }

    return NextResponse.json({
      success: true,
      data: purchase
    })

  } catch (error) {
    console.error('Save purchase error:', error)
    return NextResponse.json(
      { error: 'Failed to save purchase' },
      { status: 500 }
    )
  }
}

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
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const category = searchParams.get('category')
    const dateRange = searchParams.get('dateRange')

    // Build where clause
    const where: any = { userId }

    if (category && category !== 'all') {
      where.category = category
    }

    if (dateRange && dateRange !== 'all') {
      const now = new Date()
      let startDate: Date

      switch (dateRange) {
        case '7days':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          break
        case '30days':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          break
        case '3months':
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
          break
        case '6months':
          startDate = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000)
          break
        case '1year':
          startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
          break
        default:
          startDate = new Date(0)
      }

      where.date = {
        gte: startDate
      }
    }

    const purchases = await prisma.purchase.findMany({
      where,
      orderBy: { date: 'desc' },
      skip: offset,
      take: limit
    })

    const total = await prisma.purchase.count({ where })

    return NextResponse.json({
      success: true,
      data: purchases,
      total,
      hasMore: offset + purchases.length < total
    })

  } catch (error) {
    console.error('Get purchases error:', error)
    return NextResponse.json(
      { error: 'Failed to get purchases' },
      { status: 500 }
    )
  }
} 