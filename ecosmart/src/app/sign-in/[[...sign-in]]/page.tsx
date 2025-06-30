import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to EcoSmart
          </h1>
          <p className="text-gray-600">
            Sign in to track your carbon footprint and make a difference
          </p>
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
          <SignIn 
            appearance={{
              elements: {
                formButtonPrimary: 
                  'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-sm normal-case',
                card: 'shadow-none bg-transparent',
                headerTitle: 'hidden',
                headerSubtitle: 'hidden',
                socialButtonsBlockButton: 
                  'border-gray-200 hover:bg-gray-50 text-gray-700',
                formFieldInput: 
                  'border-gray-200 focus:border-green-500 focus:ring-green-500',
                footerActionLink: 
                  'text-green-600 hover:text-green-700'
              }
            }}
          />
        </div>
        
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            🌱 Join thousands making a positive environmental impact
          </p>
        </div>
      </div>
    </div>
  )
} 