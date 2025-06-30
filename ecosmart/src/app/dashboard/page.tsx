'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Leaf, 
  TrendingDown, 
  TrendingUp,
  Users, 
  Award, 
  Camera, 
  BarChart3,
  Plus,
  Target,
  Calendar,
  Zap,
  LogOut
} from 'lucide-react'
import Link from 'next/link'
import { UserButton, useUser } from '@clerk/nextjs'

const getCategoryEmoji = (category: string) => {
  const emojis: Record<string, string> = {
    food: '🍽️',
    transport: '🚗',
    shopping: '🛍️',
    energy: '⚡',
    entertainment: '🎬',
    health: '🏥',
    other: '📦'
  }
  return emojis[category] || '📦'
}

const getDynamicStats = (carbonData: any, purchases: any[]) => {
  const currentMonthCarbon = carbonData?.summary?.currentMonth?.total || 0
  const totalPurchases = purchases?.length || 0
  const totalSpent = purchases?.reduce((sum, p) => sum + (typeof p.amount === 'number' ? p.amount : 0), 0) || 0
  const changePercentage = carbonData?.summary?.changePercentage || 0
  const trend = carbonData?.summary?.trend || 'stable'

  return [
    {
      title: "Monthly Carbon",
      value: `${currentMonthCarbon.toFixed(1)}kg`,
      change: changePercentage > 0 ? `${changePercentage.toFixed(0)}% ${trend === 'up' ? 'more' : 'less'}` : null,
      trend: trend === 'up' ? 'up' as const : 'down' as const,
      icon: Leaf,
      color: "bg-green-500"
    },
    {
      title: "Total Spent",
      value: `$${totalSpent.toFixed(0)}`,
      change: null,
      trend: null,
      icon: Award,
      color: "bg-yellow-500"
    },
    {
      title: "Purchases",
      value: totalPurchases.toString(),
      change: null,
      trend: null,
      icon: Target,
      color: "bg-blue-500"
    },
    {
      title: "CO₂ Saved",
      value: "12kg",
      change: "vs last month",
      trend: "down" as const,
      icon: TrendingDown,
      color: "bg-purple-500"
    }
  ]
}

export default function DashboardPage() {
  const { user } = useUser()
  const [carbonData, setCarbonData] = useState<any>(null)
  const [purchases, setPurchases] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch carbon footprint data
        const carbonResponse = await fetch('/api/carbon-footprint?period=30days')
        if (carbonResponse.ok) {
          const carbonResult = await carbonResponse.json()
          setCarbonData(carbonResult.data)
        }

        // Fetch recent purchases
        const purchasesResponse = await fetch('/api/purchases?limit=5')
        if (purchasesResponse.ok) {
          const purchasesResult = await purchasesResponse.json()
          setPurchases(purchasesResult.data || [])
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchData()
    }
  }, [user])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Leaf className="h-8 w-8 text-green-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-600">
                  Welcome back{user?.firstName ? `, ${user.firstName}` : ''}! Let's save the planet together!
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard/receipt" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Add Purchase
              </Link>
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10"
                  }
                }}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {(loading ? stats : getDynamicStats(carbonData, purchases)).map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  {stat.change && (
                    <div className={`flex items-center mt-2 text-sm ${
                      stat.trend === 'up' ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {stat.trend === 'up' ? (
                        <TrendingUp className="h-4 w-4 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 mr-1" />
                      )}
                      {stat.change}
                    </div>
                  )}
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Carbon Footprint Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Carbon Footprint Trend</h2>
              <select className="text-sm border border-gray-300 rounded-lg px-3 py-1">
                <option>Last 30 days</option>
                <option>Last 3 months</option>
                <option>Last year</option>
              </select>
            </div>
            
            {/* Placeholder for chart */}
            <div className="h-64 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <p className="text-gray-600">Carbon footprint chart will appear here</p>
                <p className="text-sm text-gray-500 mt-1">Connect your data to see trends</p>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h2>
            <div className="space-y-4">
              {quickActions.map((action, index) => (
                <Link
                  key={action.title}
                  href={action.href}
                  className="w-full flex items-center p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all duration-200 text-left"
                >
                  <div className={`p-2 rounded-lg ${action.color} mr-4`}>
                    <action.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{action.title}</p>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recent Activity & Achievements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Recent Purchases */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Recent Purchases</h2>
              <Link href="/dashboard/purchases" className="text-green-600 hover:text-green-700 text-sm font-medium">
                View all
              </Link>
            </div>
            
            <div className="space-y-4">
              {(loading ? recentPurchases : purchases.slice(0, 3)).map((purchase, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-lg">{purchase.emoji || getCategoryEmoji(purchase.category)}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{purchase.item || purchase.description}</p>
                      <p className="text-sm text-gray-600">
                        {purchase.date || (purchase.createdAt ? new Date(purchase.createdAt).toLocaleDateString() : 'Recently')}
                      </p>
                    </div>
                  </div>
                                      <div className="text-right">
                      <p className="font-medium text-gray-900">
                        ${typeof purchase.amount === 'number' ? purchase.amount.toFixed(2) : '0.00'}
                      </p>
                      <p className="text-sm text-red-600">
                        {typeof (purchase.carbon || purchase.carbonImpact) === 'number' 
                          ? (purchase.carbon || purchase.carbonImpact).toFixed(1) 
                          : '0.0'}kg CO₂
                      </p>
                    </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Achievements</h2>
              <Link href="/dashboard/achievements" className="text-green-600 hover:text-green-700 text-sm font-medium">
                View all
              </Link>
            </div>
            
            <div className="space-y-4">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-center p-4 border border-gray-100 rounded-lg">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center mr-4">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{achievement.title}</p>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                    <p className="text-xs text-green-600 mt-1">+{achievement.points} points</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

const stats = [
  {
    title: "Monthly Carbon",
    value: "45.2kg",
    change: "12% less",
    trend: "down" as const,
    icon: Leaf,
    color: "bg-green-500"
  },
  {
    title: "Eco Points",
    value: "1,247",
    change: "8% more",
    trend: "up" as const,
    icon: Award,
    color: "bg-yellow-500"
  },
  {
    title: "Streak Days",
    value: "23",
    change: null,
    trend: null,
    icon: Target,
    color: "bg-blue-500"
  },
  {
    title: "CO₂ Saved",
    value: "156kg",
    change: "25% more",
    trend: "down" as const,
    icon: TrendingDown,
    color: "bg-purple-500"
  }
]

const quickActions = [
  {
    title: "Scan Receipt",
    description: "Upload a photo to analyze carbon impact",
    icon: Camera,
    color: "bg-blue-500",
    href: "/dashboard/receipt"
  },
  {
    title: "Log Transport",
    description: "Track your daily commute",
    icon: Zap,
    color: "bg-green-500",
    href: "/dashboard/transport"
  },
  {
    title: "View Purchases",
    description: "See your purchase history",
    icon: Users,
    color: "bg-purple-500",
    href: "/dashboard/purchases"
  },
  {
    title: "View Insights",
    description: "Get personalized recommendations",
    icon: BarChart3,
    color: "bg-orange-500",
    href: "/dashboard/insights"
  }
]

const recentPurchases = [
  {
    item: "Grocery Shopping",
    amount: "67.50",
    carbon: "8.2kg",
    date: "2 hours ago",
    emoji: "🛒"
  },
  {
    item: "Coffee & Pastry",
    amount: "12.30",
    carbon: "1.5kg",
    date: "Yesterday",
    emoji: "☕"
  },
  {
    item: "Gas Station",
    amount: "45.00",
    carbon: "15.2kg",
    date: "2 days ago",
    emoji: "⛽"
  }
]

const achievements = [
  {
    title: "First Week Complete",
    description: "Tracked carbon for 7 days straight",
    points: 100
  },
  {
    title: "Green Shopper",
    description: "Chose eco-friendly options 5 times",
    points: 50
  },
  {
    title: "Community Helper",
    description: "Shared a sustainability tip",
    points: 25
  }
] 