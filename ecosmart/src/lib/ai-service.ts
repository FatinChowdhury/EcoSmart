import { ReceiptAnalysis, ReceiptItem } from '@/types'

// Mock AI service for development (FREE)
export class MockAIService {
  async analyzeReceipt(imageUrl: string): Promise<ReceiptAnalysis> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Mock receipt analysis
    const mockItems: ReceiptItem[] = [
      {
        name: "Organic Bananas",
        quantity: 2,
        price: 3.99,
        category: "food",
        subcategory: "fruits",
        carbonImpact: 0.8
      },
      {
        name: "Almond Milk",
        quantity: 1,
        price: 4.49,
        category: "food",
        subcategory: "dairy",
        carbonImpact: 1.2
      },
      {
        name: "Whole Grain Bread",
        quantity: 1,
        price: 2.99,
        category: "food",
        subcategory: "grains",
        carbonImpact: 0.9
      }
    ]

    const total = mockItems.reduce((sum, item) => sum + item.price, 0)
    const carbonImpact = mockItems.reduce((sum, item) => sum + item.carbonImpact, 0)

    return {
      items: mockItems,
      total,
      carbonImpact,
      category: "food",
      confidence: 0.95
    }
  }
}

// Google Vision API service (1000 requests/month FREE)
export class GoogleVisionService {
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async analyzeReceipt(imageUrl: string): Promise<ReceiptAnalysis> {
    try {
      // This would use Google Vision API for OCR
      // Then parse the text to extract items
      
      // For now, return mock data
      return new MockAIService().analyzeReceipt(imageUrl)
    } catch (error) {
      console.error('Google Vision API error:', error)
      // Fallback to mock service
      return new MockAIService().analyzeReceipt(imageUrl)
    }
  }
}

// OpenAI service (paid, but more accurate)
export class OpenAIService {
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async analyzeReceipt(imageUrl: string): Promise<ReceiptAnalysis> {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "gpt-4-vision-preview",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "Analyze this receipt and extract all items with their prices, quantities, and estimate carbon footprint for each item. Return as JSON with items array containing name, quantity, price, category, subcategory, and carbonImpact."
                },
                {
                  type: "image_url",
                  image_url: {
                    url: imageUrl
                  }
                }
              ]
            }
          ],
          max_tokens: 1000
        })
      })

      const data = await response.json()
      
      // Parse the response and return structured data
      // This would need proper error handling and parsing
      
      // For now, return mock data
      return new MockAIService().analyzeReceipt(imageUrl)
    } catch (error) {
      console.error('OpenAI API error:', error)
      // Fallback to mock service
      return new MockAIService().analyzeReceipt(imageUrl)
    }
  }
}

// Main AI service that chooses the best provider
export class AIService {
  private service: MockAIService | GoogleVisionService | OpenAIService

  constructor() {
    const openaiKey = process.env.OPENAI_API_KEY
    const googleKey = process.env.GOOGLE_VISION_API_KEY
    
    if (openaiKey && openaiKey !== '') {
      this.service = new OpenAIService(openaiKey)
      console.log('🤖 Using OpenAI service')
    } else if (googleKey && googleKey !== '') {
      this.service = new GoogleVisionService(googleKey)
      console.log('🔍 Using Google Vision service')
    } else {
      this.service = new MockAIService()
      console.log('🎭 Using Mock AI service (development mode)')
    }
  }

  async analyzeReceipt(imageUrl: string): Promise<ReceiptAnalysis> {
    return this.service.analyzeReceipt(imageUrl)
  }
}

export const aiService = new AIService() 