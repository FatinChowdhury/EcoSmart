# 🌱 EcoSmart - AI-Powered Sustainability Platform

EcoSmart is a cutting-edge web application that helps individuals track, analyze, and reduce their carbon footprint using AI technology. Built with modern web technologies and designed to catch the attention of top tech companies.

## 🚀 Features

### Core Features
- **AI Receipt Analysis**: Upload photos of receipts and get automatic carbon impact calculations
- **Smart Carbon Tracking**: Real-time carbon footprint monitoring with detailed breakdowns
- **Personalized Recommendations**: AI-powered suggestions for reducing environmental impact
- **Community Challenges**: Join environmental challenges and compete with friends
- **Achievement System**: Gamified experience with badges and points
- **Predictive Analytics**: ML models to predict future environmental impact
- **Beautiful Dashboard**: Modern, responsive UI with interactive charts

### Technical Features
- **Next.js 15**: Latest React framework with App Router
- **TypeScript**: Full type safety throughout the application
- **Prisma ORM**: Type-safe database operations with PostgreSQL
- **NextAuth.js**: Secure authentication with multiple providers
- **Tailwind CSS**: Modern, responsive styling
- **Framer Motion**: Smooth animations and transitions
- **OpenAI Integration**: AI-powered receipt and image analysis
- **Real-time Updates**: Live data synchronization

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Charts**: Recharts
- **Forms**: React Hook Form with Zod validation

### Backend
- **API**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v5
- **File Storage**: Cloudinary (optional)
- **AI/ML**: OpenAI GPT-4 Vision API

### Development
- **Language**: TypeScript
- **Linting**: ESLint
- **Package Manager**: npm
- **Version Control**: Git

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js 18+ installed
- PostgreSQL database (local or cloud)
- OpenAI API key (for AI features)
- Git installed

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ecosmart
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/ecosmart?schema=public"

# NextAuth.js
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Providers (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_ID="your-github-id"
GITHUB_SECRET="your-github-secret"

# OpenAI API
OPENAI_API_KEY="your-openai-api-key"

# File Upload (optional)
CLOUDINARY_CLOUD_NAME="your-cloudinary-name"
CLOUDINARY_API_KEY="your-cloudinary-key"
CLOUDINARY_API_SECRET="your-cloudinary-secret"
```

### 4. Database Setup
```bash
# Generate Prisma client
npm run db:generate

# Push database schema
npm run db:push

# (Optional) Seed database
npm run db:seed
```

### 5. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
ecosmart/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   ├── auth/              # Authentication pages
│   │   ├── dashboard/         # Dashboard pages
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Homepage
│   ├── components/            # React components
│   │   ├── ui/               # Reusable UI components
│   │   ├── dashboard/        # Dashboard-specific components
│   │   └── auth/             # Authentication components
│   ├── lib/                  # Utility functions
│   │   ├── auth.ts           # NextAuth configuration
│   │   ├── db.ts             # Database client
│   │   └── utils.ts          # Helper functions
│   └── types/                # TypeScript type definitions
├── prisma/                   # Database schema and migrations
├── public/                   # Static assets
└── package.json             # Dependencies and scripts
```

## 🎯 Key Features Implementation

### AI Receipt Analysis
- Upload receipt photos
- OpenAI GPT-4 Vision extracts purchase data
- Automatic carbon impact calculation
- Smart categorization of purchases

### Carbon Footprint Tracking
- Real-time carbon calculations
- Category-based breakdowns (transport, food, energy, shopping)
- Historical trend analysis
- Goal setting and progress tracking

### Gamification System
- Points and levels
- Achievement badges
- Leaderboards
- Streak tracking
- Community challenges

### Community Features
- Social sharing of achievements
- Environmental tips and discussions
- Group challenges
- Progress comparison

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on git push

### Docker
```bash
# Build Docker image
docker build -t ecosmart .

# Run container
docker run -p 3000:3000 ecosmart
```

## 🧪 Testing

```bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Build for production
npm run build
```

## 📊 Database Schema

The application uses PostgreSQL with the following main entities:
- **Users**: User profiles and authentication
- **Purchases**: Purchase records with carbon impact
- **CarbonFootprints**: Daily/monthly carbon tracking
- **Achievements**: Gamification badges and rewards
- **Challenges**: Community environmental challenges
- **CommunityPosts**: Social features and discussions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Acknowledgments

- OpenAI for GPT-4 Vision API
- Vercel for hosting and deployment
- The open-source community for amazing tools and libraries

## 📞 Contact

For questions or suggestions, please reach out:
- Email: your-email@example.com
- LinkedIn: your-linkedin-profile
- Twitter: @your-twitter-handle

---

**Built with ❤️ for a sustainable future 🌍**
