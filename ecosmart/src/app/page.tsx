'use client'

import { motion } from 'framer-motion'
import { 
  Leaf, 
  TrendingDown, 
  Users, 
  Award, 
  Camera, 
  BarChart3,
  ArrowRight,
  Sparkles
} from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
        <div className="flex items-center space-x-2">
          <Leaf className="h-8 w-8 text-green-600" />
          <span className="text-2xl font-bold text-gray-900">EcoSmart</span>
        </div>
        <div className="flex items-center space-x-4">
          <Link 
            href="/sign-in" 
            className="px-4 py-2 text-gray-700 hover:text-green-600 transition-colors"
          >
            Sign In
          </Link>
          <Link 
            href="/sign-up" 
            className="px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="h-6 w-6 text-yellow-500 mr-2" />
            <span className="text-sm font-medium text-gray-600 bg-white/50 px-3 py-1 rounded-full">
              AI-Powered Sustainability Platform
            </span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Track Your
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
              {" "}Carbon Impact
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Join thousands of eco-conscious individuals using AI to analyze their carbon footprint, 
            get personalized recommendations, and make a real difference for our planet.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/sign-up"
              className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-full font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center"
            >
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <button className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-full font-semibold hover:border-green-600 hover:text-green-600 transition-all duration-300">
              Watch Demo
            </button>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Go Green
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Powerful AI tools and community features to help you reduce your carbon footprint
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 * index }}
              className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20"
            >
              <div className={`inline-flex p-3 rounded-xl ${feature.color} mb-4`}>
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-gradient-to-r from-green-600 to-blue-600 rounded-3xl p-12 text-white text-center"
        >
          <h2 className="text-3xl font-bold mb-8">Join the Movement</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-green-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Start tracking your carbon footprint today and join thousands of others 
            working towards a sustainable future.
          </p>
          <Link 
            href="/sign-up"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-full font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Get Started Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center mb-6">
            <Leaf className="h-8 w-8 text-green-400 mr-2" />
            <span className="text-2xl font-bold">EcoSmart</span>
          </div>
          <p className="text-gray-400 mb-4">
            Making sustainability accessible through AI and community
          </p>
          <div className="flex justify-center space-x-6 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

const features = [
  {
    icon: Camera,
    title: "AI Receipt Analysis",
    description: "Simply snap a photo of your receipt and our AI will automatically calculate the carbon impact of your purchases.",
    color: "bg-gradient-to-br from-blue-500 to-blue-600"
  },
  {
    icon: BarChart3,
    title: "Smart Analytics",
    description: "Get detailed insights into your carbon footprint with beautiful charts and personalized recommendations.",
    color: "bg-gradient-to-br from-green-500 to-green-600"
  },
  {
    icon: TrendingDown,
    title: "Carbon Reduction",
    description: "Track your progress over time and see how your choices are making a positive impact on the environment.",
    color: "bg-gradient-to-br from-purple-500 to-purple-600"
  },
  {
    icon: Users,
    title: "Community Impact",
    description: "Connect with like-minded individuals, share tips, and participate in environmental challenges together.",
    color: "bg-gradient-to-br from-orange-500 to-orange-600"
  },
  {
    icon: Award,
    title: "Achievements",
    description: "Earn badges and points for reducing your carbon footprint and achieving sustainability milestones.",
    color: "bg-gradient-to-br from-yellow-500 to-yellow-600"
  },
  {
    icon: Sparkles,
    title: "AI Recommendations",
    description: "Get personalized suggestions for eco-friendly alternatives based on your lifestyle and location.",
    color: "bg-gradient-to-br from-pink-500 to-pink-600"
  }
]

const stats = [
  { value: "10K+", label: "Active Users" },
  { value: "50K+", label: "Tons CO₂ Saved" },
  { value: "100K+", label: "Receipts Analyzed" }
]
