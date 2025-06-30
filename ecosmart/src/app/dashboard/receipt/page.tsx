'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Camera, 
  Upload, 
  X, 
  CheckCircle, 
  AlertCircle,
  Leaf,
  ArrowLeft,
  Loader2
} from 'lucide-react'
import Link from 'next/link'
import { useDropzone } from 'react-dropzone'
import { useUser } from '@clerk/nextjs'

interface ReceiptItem {
  name: string
  quantity: number
  price: number
  category: string
  subcategory?: string
  carbonImpact: number
}

interface ReceiptAnalysis {
  items: ReceiptItem[]
  total: number
  carbonImpact: number
  category: string
  confidence: number
}

export default function ReceiptUploadPage() {
  const { user } = useUser()
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<ReceiptAnalysis | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0]
      if (file) {
        setUploadedFile(file)
        setPreviewUrl(URL.createObjectURL(file))
        setAnalysis(null)
        setError(null)
      }
    }
  })

  const analyzeReceipt = async () => {
    if (!uploadedFile) return

    setIsAnalyzing(true)
    setError(null)

    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('receipt', uploadedFile)

      const response = await fetch('/api/analyze-receipt', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Failed to analyze receipt')
      }

      const result = await response.json()
      setAnalysis(result.data)
    } catch (err) {
      setError('Failed to analyze receipt. Please try again.')
      console.error('Receipt analysis error:', err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const savePurchase = async () => {
    if (!analysis || !user) return

    setIsSaving(true)
    try {
      const response = await fetch('/api/purchases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user.id,
          amount: analysis.total,
          description: `Receipt with ${analysis.items.length} items`,
          category: analysis.category,
          carbonImpact: analysis.carbonImpact,
          items: analysis.items
        })
      })

      if (!response.ok) {
        throw new Error('Failed to save purchase')
      }

      // Reset form
      setUploadedFile(null)
      setPreviewUrl(null)
      setAnalysis(null)
      
      // Show success message or redirect
      alert('Purchase saved successfully!')
    } catch (err) {
      setError('Failed to save purchase. Please try again.')
      console.error('Save purchase error:', err)
    } finally {
      setIsSaving(false)
    }
  }

  const resetUpload = () => {
    setUploadedFile(null)
    setPreviewUrl(null)
    setAnalysis(null)
    setError(null)
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
                <Camera className="h-6 w-6 text-green-600" />
                <h1 className="text-2xl font-bold text-gray-900">Scan Receipt</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Upload Receipt Photo
              </h2>

              {!previewUrl ? (
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    isDragActive 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-300 hover:border-green-400 hover:bg-gray-50'
                  }`}
                >
                  <input {...getInputProps()} />
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    {isDragActive ? 'Drop your receipt here' : 'Upload receipt photo'}
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    Drag and drop or click to browse
                  </p>
                  <p className="text-xs text-gray-500">
                    Supports JPG, PNG, WebP (max 10MB)
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <img
                      src={previewUrl}
                      alt="Receipt preview"
                      className="w-full h-64 object-cover rounded-lg border"
                    />
                    <button
                      onClick={resetUpload}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {!analysis && (
                    <button
                      onClick={analyzeReceipt}
                      disabled={isAnalyzing}
                      className="w-full py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Analyzing Receipt...
                        </>
                      ) : (
                        <>
                          <Camera className="h-5 w-5 mr-2" />
                          Analyze with AI
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}

              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}
            </div>

            {/* Tips */}
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-3">📸 Photo Tips</h3>
              <ul className="text-sm text-blue-800 space-y-2">
                <li>• Ensure receipt is well-lit and flat</li>
                <li>• Capture the entire receipt including header and footer</li>
                <li>• Avoid shadows and reflections</li>
                <li>• Higher resolution = better accuracy</li>
              </ul>
            </div>
          </motion.div>

          {/* Analysis Results */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {analysis ? (
              <>
                {/* Summary Card */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Analysis Results</h2>
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="h-5 w-5 mr-1" />
                      <span className="text-sm font-medium">
                        {Math.round(analysis.confidence * 100)}% confident
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600">Total Amount</p>
                      <p className="text-2xl font-bold text-gray-900">
                        ${analysis.total.toFixed(2)}
                      </p>
                    </div>
                    <div className="bg-red-50 rounded-lg p-4">
                      <p className="text-sm text-red-600">Carbon Impact</p>
                      <p className="text-2xl font-bold text-red-700">
                        {analysis.carbonImpact.toFixed(1)}kg CO₂
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-medium text-gray-900">Items Detected</h3>
                    {analysis.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-600">
                            {item.quantity}x • {item.category}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">${item.price.toFixed(2)}</p>
                          <p className="text-sm text-red-600">{item.carbonImpact.toFixed(1)}kg CO₂</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={savePurchase}
                    disabled={isSaving}
                    className="w-full mt-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Saving Purchase...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-5 w-5 mr-2" />
                        Save Purchase
                      </>
                    )}
                  </button>
                </div>

                {/* Environmental Impact */}
                <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
                  <div className="flex items-center mb-4">
                    <Leaf className="h-6 w-6 text-green-600 mr-2" />
                    <h3 className="font-semibold text-green-900">Environmental Impact</h3>
                  </div>
                  <p className="text-sm text-green-800 mb-3">
                    This purchase generated <strong>{analysis.carbonImpact.toFixed(1)}kg of CO₂</strong>.
                    Here are some eco-friendly alternatives for next time:
                  </p>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Choose local and organic products when possible</li>
                    <li>• Bring reusable bags to reduce packaging waste</li>
                    <li>• Consider plant-based alternatives for meat products</li>
                    <li>• Buy in bulk to reduce packaging per unit</li>
                  </ul>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
                <Camera className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Upload a receipt to get started
                </h3>
                <p className="text-gray-600">
                  Our AI will analyze your receipt and calculate the carbon impact of your purchases
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
} 