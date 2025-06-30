import { User, Purchase, CarbonFootprint, Achievement, UserAchievement, CommunityPost, Challenge, UserChallenge } from '@prisma/client'

// Extended user type with relations
export type ExtendedUser = User & {
  purchases: Purchase[]
  carbonFootprints: CarbonFootprint[]
  achievements: (UserAchievement & { achievement: Achievement })[]
  communityPosts: CommunityPost[]
  challenges: (UserChallenge & { challenge: Challenge })[]
}

// Dashboard data types
export interface DashboardData {
  user: ExtendedUser
  monthlyCarbon: number
  carbonTrend: number
  recentPurchases: Purchase[]
  achievements: Achievement[]
  challenges: Challenge[]
  leaderboard: LeaderboardEntry[]
}

export interface LeaderboardEntry {
  id: string
  name: string
  image?: string
  points: number
  level: number
  carbonReduction: number
}

// Carbon footprint analysis
export interface CarbonAnalysis {
  total: number
  breakdown: {
    transport: number
    food: number
    energy: number
    shopping: number
    other: number
  }
  trend: 'up' | 'down' | 'stable'
  recommendations: Recommendation[]
}

export interface Recommendation {
  id: string
  category: string
  title: string
  description: string
  impact: number // kg CO2 saved
  difficulty: 'easy' | 'medium' | 'hard'
  icon: string
}

// Receipt analysis types
export interface ReceiptAnalysis {
  items: ReceiptItem[]
  total: number
  carbonImpact: number
  category: string
  confidence: number
}

export interface ReceiptItem {
  name: string
  quantity: number
  price: number
  category: string
  subcategory?: string
  carbonImpact: number
}

// AI Analysis types
export interface AIAnalysisRequest {
  imageUrl: string
  type: 'receipt' | 'product' | 'meal'
}

export interface AIAnalysisResponse {
  success: boolean
  data?: ReceiptAnalysis
  error?: string
}

// Community types
export type ExtendedCommunityPost = CommunityPost & {
  user: Pick<User, 'id' | 'name' | 'image'>
  _count: {
    comments: number
    postLikes: number
  }
}

// Achievement types
export interface AchievementProgress {
  achievement: Achievement
  progress: number
  isUnlocked: boolean
  unlockedAt?: Date
}

// Challenge types
export type ExtendedChallenge = Challenge & {
  _count: {
    participants: number
  }
  userProgress?: {
    progress: number
    completed: boolean
  }
}

// Form types
export interface PurchaseFormData {
  amount: number
  description: string
  category: string
  subcategory?: string
  date: Date
  image?: File
}

export interface ProfileFormData {
  name: string
  location?: string
  carbonGoal: number
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Chart data types
export interface ChartData {
  name: string
  value: number
  color?: string
}

export interface TimeSeriesData {
  date: string
  value: number
  category?: string
}

// Notification types
export interface Notification {
  id: string
  type: 'achievement' | 'challenge' | 'tip' | 'milestone'
  title: string
  message: string
  read: boolean
  createdAt: Date
  actionUrl?: string
}

// Search and filter types
export interface SearchFilters {
  category?: string
  dateRange?: {
    start: Date
    end: Date
  }
  sortBy?: 'date' | 'amount' | 'carbon'
  sortOrder?: 'asc' | 'desc'
}

// Gamification types
export interface UserStats {
  totalPoints: number
  level: number
  rank: number
  streakDays: number
  totalCarbonSaved: number
  achievementsUnlocked: number
}

// ML Model types
export interface CarbonPrediction {
  predictedCarbon: number
  confidence: number
  factors: string[]
  recommendations: Recommendation[]
}

// Settings types
export interface UserSettings {
  notifications: {
    email: boolean
    push: boolean
    achievements: boolean
    challenges: boolean
    tips: boolean
  }
  privacy: {
    profileVisibility: 'public' | 'friends' | 'private'
    shareProgress: boolean
    showInLeaderboard: boolean
  }
  preferences: {
    units: 'metric' | 'imperial'
    currency: string
    language: string
    theme: 'light' | 'dark' | 'system'
  }
} 