'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Car, 
  Train, 
  Bus,
  Bike,
  Footprints,
  Plane,
  ArrowLeft,
  Plus,
  MapPin,
  Clock,
  Fuel,
  CheckCircle,
  TrendingDown
} from 'lucide-react'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'

interface TransportMode {
  id: string
  name: string
  icon: React.ElementType
  carbonFactor: number // kg CO2 per km
  color: string
  description: string
}

interface TransportEntry {
  mode: string
  distance: number
  duration?: number
  from: string
  to: string
  carbonImpact: number
}

const transportModes: TransportMode[] = [
  {
    id: 'car',
    name: 'Car (Gasoline)',
    icon: Car,
    carbonFactor: 0.21, // kg CO2 per km
    color: 'bg-red-500',
    description: 'Personal vehicle'
  },
  {
    id: 'electric-car',
    name: 'Electric Car',
    icon: Car,
    carbonFactor: 0.05,
    color: 'bg-green-500',
    description: 'Zero-emission vehicle'
  },
  {
    id: 'bus',
    name: 'Bus',
    icon: Bus,
    carbonFactor: 0.08,
    color: 'bg-blue-500',
    description: 'Public transport'
  },
  {
    id: 'train',
    name: 'Train/Metro',
    icon: Train,
    carbonFactor: 0.04,
    color: 'bg-purple-500',
    description: 'Rail transport'
  },
  {
    id: 'bike',
    name: 'Bicycle',
    icon: Bike,
    carbonFactor: 0,
    color: 'bg-green-600',
    description: 'Zero emissions'
  },
  {
    id: 'walk',
    name: 'Walking',
    icon: Footprints,
    carbonFactor: 0,
    color: 'bg-green-700',
    description: 'Zero emissions'
  },
  {
    id: 'plane',
    name: 'Airplane',
    icon: Plane,
    carbonFactor: 0.25,
    color: 'bg-orange-500',
    description: 'Domestic flights'
  }
]

export default function TransportPage() {
  const { user } = useUser()
  const [selectedMode, setSelectedMode] = useState<TransportMode | null>(null)
  const [formData, setFormData] = useState<TransportEntry>({
    mode: '',
    distance: 0,
    duration: 0,
    from: '',
    to: '',
    carbonImpact: 0
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleModeSelect = (mode: TransportMode) => {
    setSelectedMode(mode)
    setFormData(prev => ({
      ...prev,
      mode: mode.id,
      carbonImpact: prev.distance * mode.carbonFactor
    }))
  }

  const handleDistanceChange = (distance: number) => {
    setFormData(prev => ({
      ...prev,
      distance,
      carbonImpact: selectedMode ? distance * selectedMode.carbonFactor : 0
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedMode || !formData.distance || !formData.from || !formData.to) return

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/purchases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: 0, // Transport might be free
          description: `${selectedMode.name}: ${formData.from} → ${formData.to} (${formData.distance}km)`,
          category: 'transport',
          subcategory: selectedMode.id,
          carbonImpact: formData.carbonImpact
        })
      })

      if (response.ok) {
        setShowSuccess(true)
        // Reset form
        setFormData({
          mode: '',
          distance: 0,
          duration: 0,
          from: '',
          to: '',
          carbonImpact: 0
        })
        setSelectedMode(null)
        
        setTimeout(() => setShowSuccess(false), 3000)
      }
    } catch (error) {
      console.error('Error saving transport:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Link 
                href="/dashboard" 
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </Link>
              <div className="flex items-center space-x-2">
                <Car className="h-6 w-6 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">Log Transport</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center"
          >
            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            <p className="text-green-800">Transport logged successfully!</p>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Transport Mode Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Choose Transport Mode
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {transportModes.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => handleModeSelect(mode)}
                    className={`p-4 border-2 rounded-lg transition-all duration-200 text-left ${
                      selectedMode?.id === mode.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${mode.color}`}>
                        <mode.icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{mode.name}</p>
                        <p className="text-sm text-gray-600">{mode.description}</p>
                        <p className="text-xs text-green-600 mt-1">
                          {mode.carbonFactor === 0 
                            ? 'Zero emissions' 
                            : `${mode.carbonFactor} kg CO₂/km`
                          }
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Environmental Impact */}
            {selectedMode && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 border border-green-200"
              >
                <div className="flex items-center mb-4">
                  <TrendingDown className="h-6 w-6 text-green-600 mr-2" />
                  <h3 className="font-semibold text-green-900">Environmental Impact</h3>
                </div>
                
                {selectedMode.carbonFactor === 0 ? (
                  <p className="text-green-800">
                    🎉 Excellent choice! <strong>{selectedMode.name}</strong> produces zero emissions.
                    You're making a positive impact on the environment!
                  </p>
                ) : (
                  <div>
                    <p className="text-green-800 mb-3">
                      <strong>{selectedMode.name}</strong> produces{' '}
                      <strong>{selectedMode.carbonFactor} kg CO₂ per kilometer</strong>.
                    </p>
                    <p className="text-sm text-green-700">
                      💡 Consider switching to public transport, cycling, or walking for shorter distances 
                      to reduce your carbon footprint.
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>

          {/* Journey Details Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Journey Details
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* From Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    From
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={formData.from}
                      onChange={(e) => setFormData(prev => ({ ...prev, from: e.target.value }))}
                      placeholder="Starting location"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                {/* To Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    To
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={formData.to}
                      onChange={(e) => setFormData(prev => ({ ...prev, to: e.target.value }))}
                      placeholder="Destination"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                {/* Distance */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Distance (km)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.distance || ''}
                    onChange={(e) => handleDistanceChange(parseFloat(e.target.value) || 0)}
                    placeholder="0.0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Duration (Optional) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (minutes) - Optional
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="number"
                      min="0"
                      value={formData.duration || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                      placeholder="30"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Carbon Impact Display */}
                {selectedMode && formData.distance > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Carbon Impact:</span>
                      <span className={`font-bold ${formData.carbonImpact === 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formData.carbonImpact === 0 ? '0 kg CO₂' : `${formData.carbonImpact.toFixed(2)} kg CO₂`}
                      </span>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!selectedMode || !formData.distance || !formData.from || !formData.to || isSubmitting}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Logging Journey...
                    </>
                  ) : (
                    <>
                      <Plus className="h-5 w-5 mr-2" />
                      Log Journey
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Tips */}
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-3">🚀 Pro Tips</h3>
              <ul className="text-sm text-blue-800 space-y-2">
                <li>• Use GPS apps to get accurate distance measurements</li>
                <li>• Log both directions of your journey for complete tracking</li>
                <li>• Consider combining trips to reduce overall emissions</li>
                <li>• Try car-free days to significantly reduce your footprint</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
} 