import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Carbon footprint calculation utilities
export const CARBON_FACTORS = {
  // Transport (kg CO2 per km)
  car_gasoline: 0.21,
  car_diesel: 0.17,
  car_electric: 0.05,
  bus: 0.08,
  train: 0.04,
  plane_domestic: 0.25,
  plane_international: 0.18,
  
  // Food (kg CO2 per serving/kg)
  beef: 27.0,
  pork: 12.1,
  chicken: 6.9,
  fish: 6.1,
  dairy: 3.2,
  vegetables: 2.0,
  fruits: 1.1,
  grains: 1.4,
  
  // Energy (kg CO2 per kWh)
  electricity_grid: 0.5,
  natural_gas: 0.18,
  heating_oil: 0.27,
  
  // Shopping categories (average kg CO2 per dollar spent)
  clothing: 0.5,
  electronics: 0.3,
  home_goods: 0.2,
  books_media: 0.1,
}

export function calculateCarbonImpact(
  category: string,
  subcategory: string,
  amount: number,
  quantity?: number
): number {
  const key = `${category}_${subcategory}` as keyof typeof CARBON_FACTORS
  const factor = CARBON_FACTORS[key] || 0.1 // Default factor
  
  return (quantity || 1) * amount * factor
}

export function formatCarbonValue(value: number): string {
  if (value < 1) {
    return `${Math.round(value * 1000)}g CO₂`
  }
  return `${value.toFixed(1)}kg CO₂`
}

export function getCarbonLevel(totalCarbon: number): {
  level: string
  color: string
  description: string
} {
  if (totalCarbon < 50) {
    return {
      level: "Excellent",
      color: "text-green-600",
      description: "Your carbon footprint is very low!"
    }
  } else if (totalCarbon < 100) {
    return {
      level: "Good",
      color: "text-blue-600",
      description: "You're doing well, keep it up!"
    }
  } else if (totalCarbon < 200) {
    return {
      level: "Average",
      color: "text-yellow-600",
      description: "There's room for improvement"
    }
  } else {
    return {
      level: "High",
      color: "text-red-600",
      description: "Consider reducing your carbon footprint"
    }
  }
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date)
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
} 