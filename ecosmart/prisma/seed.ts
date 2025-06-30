import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create sample achievements
  const achievements = [
    {
      name: "First Steps",
      description: "Complete your first carbon footprint entry",
      icon: "👣",
      category: "getting_started",
      points: 50,
      condition: JSON.stringify({ type: "first_entry" })
    },
    {
      name: "Week Warrior",
      description: "Track your carbon footprint for 7 consecutive days",
      icon: "🗓️",
      category: "streak",
      points: 100,
      condition: JSON.stringify({ type: "streak", days: 7 })
    },
    {
      name: "Green Shopper",
      description: "Make 5 eco-friendly purchase choices",
      icon: "🛒",
      category: "shopping",
      points: 75,
      condition: JSON.stringify({ type: "eco_purchases", count: 5 })
    },
    {
      name: "Carbon Reducer",
      description: "Reduce your monthly carbon footprint by 10%",
      icon: "📉",
      category: "carbon_reduction",
      points: 150,
      condition: JSON.stringify({ type: "carbon_reduction", percentage: 10 })
    },
    {
      name: "Community Helper",
      description: "Share your first sustainability tip",
      icon: "🤝",
      category: "community",
      points: 25,
      condition: JSON.stringify({ type: "first_post" })
    },
    {
      name: "Eco Master",
      description: "Achieve a monthly carbon footprint under 50kg CO₂",
      icon: "🏆",
      category: "carbon_reduction",
      points: 200,
      condition: JSON.stringify({ type: "low_carbon", threshold: 50 })
    },
    {
      name: "Streak Master",
      description: "Maintain a 30-day tracking streak",
      icon: "🔥",
      category: "streak",
      points: 300,
      condition: JSON.stringify({ type: "streak", days: 30 })
    },
    {
      name: "Receipt Scanner",
      description: "Scan your first receipt with AI analysis",
      icon: "📸",
      category: "technology",
      points: 50,
      condition: JSON.stringify({ type: "first_ai_scan" })
    }
  ]

  for (const achievement of achievements) {
    await prisma.achievement.create({
      data: achievement
    })
  }

  // Create sample challenges
  const challenges = [
    {
      name: "Zero Waste Week",
      description: "Reduce your waste generation by avoiding single-use items for a week",
      category: "waste_reduction",
      target: 7,
      unit: "days",
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      points: 100,
      isGlobal: true
    },
    {
      name: "Plant-Based Month",
      description: "Reduce meat consumption and try plant-based alternatives for 30 days",
      category: "food",
      target: 30,
      unit: "days",
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      points: 250,
      isGlobal: true
    },
    {
      name: "Public Transport Challenge",
      description: "Use public transportation or bike instead of car for 2 weeks",
      category: "transport",
      target: 14,
      unit: "days",
      startDate: new Date(),
      endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      points: 150,
      isGlobal: true
    },
    {
      name: "Energy Saver",
      description: "Reduce home energy consumption by 20% this month",
      category: "energy",
      target: 20,
      unit: "percentage",
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      points: 200,
      isGlobal: true
    },
    {
      name: "Local Shopping Spree",
      description: "Buy from local businesses and farmers markets for 2 weeks",
      category: "shopping",
      target: 14,
      unit: "days",
      startDate: new Date(),
      endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      points: 125,
      isGlobal: true
    }
  ]

  for (const challenge of challenges) {
    await prisma.challenge.create({
      data: challenge
    })
  }

  console.log('✅ Database seeded successfully!')
  console.log(`📊 Created ${achievements.length} achievements`)
  console.log(`🎯 Created ${challenges.length} challenges`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 