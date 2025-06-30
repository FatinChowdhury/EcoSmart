'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  ShoppingBag, 
  Calendar, 
  Filter,
  TrendingDown,
  TrendingUp,
  ArrowLeft,
  Search,
  Download,
  Eye,
  Trash2
} from 'lucide-react'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import { format, startOfMonth, endOfMonth, subMonths, isWithinInterval } from 'date-fns'

interface Purchase {
  id: string
  amount: number
  description: string
  category: string
  subcategory?: string
  carbonImpact: number
  imageUrl?: string
  date: string
  createdAt: string
}

type DateRange = '7days' | '30days' | '3months' | '6months' | '1year' | 'all'

export default function PurchasesPage() {
  const { user } = useUser()
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [filteredPurchases, setFilteredPurchases] = useState<Purchase[]>([])
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState<DateRange>('30days')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'carbon'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // Mock data for demonstration
  useEffect(() => {
    const mockPurchases: Purchase[] = [
      {
        id: '1',
        amount: 67.50,
        description: 'Grocery Shopping - Whole Foods',
        category: 'food',
        subcategory: 'groceries',
        carbonImpact: 8.2,
        date: new Date().toISOString(),
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        amount: 12.30,
        description: 'Coffee & Pastry - Local Cafe',
        category: 'food',
        subcategory: 'dining',
        carbonImpact: 1.5,
        date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        amount: 45.00,
        description: 'Gas Station Fill-up',
        category: 'transport',
        subcategory: 'fuel',
        carbonImpact: 15.2,
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '4',
        amount: 89.99,
        description: 'Online Shopping - Electronics',
        category: 'shopping',
        subcategory: 'electronics',
        carbonImpact: 12.8,
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '5',
        amount: 23.75,
        description: 'Public Transport - Monthly Pass',
        category: 'transport',
        subcategory: 'public',
        carbonImpact: 2.1,
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '6',
        amount: 156.00,
        description: 'Electricity Bill',
        category: 'energy',
        subcategory: 'electricity',
        carbonImpact: 18.4,
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]

    // Simulate API call
    setTimeout(() => {
      setPurchases(mockPurchases)
      setLoading(false)
    }, 1000)
  }, [])

  // Filter and sort purchases
  useEffect(() => {
    let filtered = [...purchases]

    // Date range filter
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

    if (dateRange !== 'all') {
      filtered = filtered.filter(purchase => 
        new Date(purchase.date) >= startDate
      )
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(purchase => purchase.category === categoryFilter)
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(purchase =>
        purchase.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        purchase.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: number | string, bValue: number | string

      switch (sortBy) {
        case 'amount':
          aValue = a.amount
          bValue = b.amount
          break
        case 'carbon':
          aValue = a.carbonImpact
          bValue = b.carbonImpact
          break
        default:
          aValue = new Date(a.date).getTime()
          bValue = new Date(b.date).getTime()
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    setFilteredPurchases(filtered)
  }, [purchases, dateRange, categoryFilter, searchQuery, sortBy, sortOrder])

  // Calculate summary stats
  const totalAmount = filteredPurchases.reduce((sum, p) => sum + p.amount, 0)
  const totalCarbon = filteredPurchases.reduce((sum, p) => sum + p.carbonImpact, 0)
  const avgCarbon = filteredPurchases.length > 0 ? totalCarbon / filteredPurchases.length : 0

  const categories = Array.from(new Set(purchases.map(p => p.category)))

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

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      food: 'bg-green-100 text-green-800',
      transport: 'bg-blue-100 text-blue-800',
      shopping: 'bg-purple-100 text-purple-800',
      energy: 'bg-yellow-100 text-yellow-800',
      entertainment: 'bg-pink-100 text-pink-800',
      health: 'bg-red-100 text-red-800',
      other: 'bg-gray-100 text-gray-800'
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Link 
                href="/dashboard" 
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </Link>
              <div className="flex items-center space-x-2">
                <ShoppingBag className="h-6 w-6 text-green-600" />
                <h1 className="text-2xl font-bold text-gray-900">Purchase History</h1>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors flex items-center">
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
              <Link 
                href="/dashboard/receipt" 
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Add Purchase
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">${totalAmount.toFixed(2)}</p>
                <p className="text-sm text-gray-500 mt-1">{filteredPurchases.length} purchases</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <ShoppingBag className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Carbon</p>
                <p className="text-2xl font-bold text-red-700">{totalCarbon.toFixed(1)}kg CO₂</p>
                <p className="text-sm text-gray-500 mt-1">Environmental impact</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg per Purchase</p>
                <p className="text-2xl font-bold text-orange-600">{avgCarbon.toFixed(1)}kg CO₂</p>
                <p className="text-sm text-gray-500 mt-1">Carbon efficiency</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <TrendingDown className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search purchases..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Date Range */}
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as DateRange)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="7days">Last 7 days</option>
                <option value="30days">Last 30 days</option>
                <option value="3months">Last 3 months</option>
                <option value="6months">Last 6 months</option>
                <option value="1year">Last year</option>
                <option value="all">All time</option>
              </select>

              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {getCategoryEmoji(category)} {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Options */}
            <div className="flex items-center space-x-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'amount' | 'carbon')}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="date">Sort by Date</option>
                <option value="amount">Sort by Amount</option>
                <option value="carbon">Sort by Carbon</option>
              </select>
              
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {sortOrder === 'asc' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Purchases List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100"
        >
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading purchases...</p>
            </div>
          ) : filteredPurchases.length === 0 ? (
            <div className="p-8 text-center">
              <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No purchases found</h3>
              <p className="text-gray-600 mb-4">
                {searchQuery || categoryFilter !== 'all' 
                  ? 'Try adjusting your filters or search terms'
                  : 'Start by adding your first purchase'
                }
              </p>
              <Link 
                href="/dashboard/receipt"
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Add Purchase
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredPurchases.map((purchase, index) => (
                <motion.div
                  key={purchase.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-2xl">{getCategoryEmoji(purchase.category)}</span>
                        <div>
                          <h3 className="font-medium text-gray-900">{purchase.description}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(purchase.category)}`}>
                              {purchase.category}
                            </span>
                            {purchase.subcategory && (
                              <span className="text-xs text-gray-500">• {purchase.subcategory}</span>
                            )}
                            <span className="text-xs text-gray-500">
                              • {format(new Date(purchase.date), 'MMM d, yyyy')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">${purchase.amount.toFixed(2)}</p>
                        <p className="text-sm text-red-600">{purchase.carbonImpact.toFixed(1)}kg CO₂</p>
                      </div>

                      <div className="flex items-center space-x-2">
                        {purchase.imageUrl && (
                          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                            <Eye className="h-4 w-4" />
                          </button>
                        )}
                        <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
} 