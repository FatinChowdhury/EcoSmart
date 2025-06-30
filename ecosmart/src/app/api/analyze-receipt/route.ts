import { NextRequest, NextResponse } from 'next/server'
import { AIService } from '@/lib/ai-service'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('receipt') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      )
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 10MB' },
        { status: 400 }
      )
    }

    // Convert file to base64 for AI processing
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')
    const imageUrl = `data:${file.type};base64,${base64}`

    // Analyze receipt with AI service
    const aiService = new AIService()
    const analysis = await aiService.analyzeReceipt(imageUrl)

    return NextResponse.json({
      success: true,
      data: analysis
    })

  } catch (error) {
    console.error('Receipt analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze receipt' },
      { status: 500 }
    )
  }
} 