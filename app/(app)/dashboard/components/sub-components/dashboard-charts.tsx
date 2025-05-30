"use client"

import { useMemo } from "react"
import { HeartRateChart } from '@/app/(app)/dashboard/components/charts/heartrate-chart'
import { TemperatureChart } from '@/app/(app)/dashboard/components/charts/temperature-chart'
import { MacronutrientChart } from '@/app/(app)/dashboard/components/charts/macronutrient-chart'
import { ActivityChart } from '@/app/(app)/dashboard/components/charts/activity-chart'
import { CaloriesChart } from '@/app/(app)/dashboard/components/charts/calories-chart'
import { Food } from "../../../health/nutrition/types"

interface DashboardChartsProps {
  healthRecords: any[]
  nutritionLogs: any[]
  stravaActivities: any[]
  sensorData: any[]
  consumedFoods: Food[]
}

const chartConfig = {
  records: { label: "Records", color: "hsl(210, 90%, 65%)" },
  calories: { label: "Calories", color: "hsl(150, 70%, 60%)" },
  count: { label: "Count", color: "hsl(280, 60%, 65%)" },
  distance: { label: "Distance (km)", color: "hsl(20, 80%, 65%)" },
  heartRate: { label: "Heart Rate", color: "hsl(340 75% 55%)" },
  temperature: { label: "Temperature", color: "hsl(150, 70%, 60%)" },
  humidity: { label: "Humidity", color: "hsl(150, 70%, 60%)" },
  protein: { label: "Protein", color: "hsl(var(--chart-1))" },
  carbs: { label: "Carbs", color: "hsl(var(--chart-2))" },
  fat: { label: "Fat", color: "hsl(var(--chart-3))" },
}

export function DashboardCharts({ 
  healthRecords, 
  nutritionLogs, 
  stravaActivities,
  sensorData,
  consumedFoods
}: DashboardChartsProps) {
  const recordsOverTime = useMemo(() => {
    const recordsByDate: { [key: string]: number } = {}
    healthRecords.forEach(record => {
      const date = new Date(record.created_at).toLocaleDateString()
      recordsByDate[date] = (recordsByDate[date] || 0) + 1
    })
    return Object.entries(recordsByDate).map(([date, count]) => ({ date, count }))
  }, [healthRecords])

  const nutritionOverTime = useMemo(() => {
    const caloriesByDate: { [key: string]: number } = {}
    nutritionLogs.forEach(log => {
      const date = new Date(log.date).toLocaleDateString()
      caloriesByDate[date] = (caloriesByDate[date] || 0) + log.total_calories
    })
    return Object.entries(caloriesByDate).map(([date, calories]) => ({ date, calories }))
  }, [nutritionLogs])

  const recordTypes = useMemo(() => {
    const types: { [key: string]: number } = {}
    healthRecords.forEach(record => {
      types[record.file_type] = (types[record.file_type] || 0) + 1
    })
    return Object.entries(types).map(([name, value]) => ({ name, value }))
  }, [healthRecords])

  const activityData = useMemo(() => {
    return stravaActivities
  }, [stravaActivities])

  const heartRateData = useMemo(() => {
    return sensorData.map(reading => ({
      time: new Date(reading.created_at).toLocaleTimeString(),
      value: reading.beat_avg
    })).reverse()
  }, [sensorData])

  const temperatureData = useMemo(() => {
    return sensorData.map(reading => ({
      time: new Date(reading.created_at).toLocaleTimeString(),
      temp: reading.temperature_c,
      humidity: reading.humidity
    })).reverse()
  }, [sensorData])

  const macronutrients = useMemo(() => {
    // Get today's date at start of day for comparison
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Filter for foods consumed today
    const todaysFoods = consumedFoods.filter(food => {
      const foodDate = new Date(food.consumed_at)
      foodDate.setHours(0, 0, 0, 0)
      return foodDate.getTime() === today.getTime()
    })

    // If no foods today, get the most recent day's foods
    if (todaysFoods.length === 0) {
      const dates = consumedFoods.map(food => {
        const date = new Date(food.consumed_at)
        date.setHours(0, 0, 0, 0)
        return date.getTime()
      })
      
      const mostRecentDate = Math.max(...dates)
      const mostRecentFoods = consumedFoods.filter(food => {
        const foodDate = new Date(food.consumed_at)
        foodDate.setHours(0, 0, 0, 0)
        return foodDate.getTime() === mostRecentDate
      })
      
      todaysFoods.push(...mostRecentFoods)
    }

    const totalProtein = Math.round(todaysFoods.reduce((sum, food) => sum + (food.protein || 0), 0))
    const totalCarbs = Math.round(todaysFoods.reduce((sum, food) => sum + (food.carbs || 0), 0))
    const totalFat = Math.round(todaysFoods.reduce((sum, food) => sum + (food.fat || 0), 0))
    
    return [
      { 
        name: 'Protein', 
        value: totalProtein, 
        fill: chartConfig.protein.color, 
        percent: Math.round((totalProtein / (totalProtein + totalCarbs + totalFat)) * 100) 
      },
      { 
        name: 'Carbs', 
        value: totalCarbs, 
        fill: chartConfig.carbs.color, 
        percent: Math.round((totalCarbs / (totalProtein + totalCarbs + totalFat)) * 100) 
      },
      { 
        name: 'Fat', 
        value: totalFat, 
        fill: chartConfig.fat.color, 
        percent: Math.round((totalFat / (totalProtein + totalCarbs + totalFat)) * 100) 
      },
    ]
  }, [consumedFoods, chartConfig])

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <HeartRateChart 
        data={heartRateData} 
        config={chartConfig} 
      />
      
      <TemperatureChart 
        data={temperatureData} 
      />

      <MacronutrientChart 
        data={macronutrients} 
        config={chartConfig} 
      />

      <CaloriesChart 
        data={nutritionOverTime} 
        config={chartConfig} 
      />

      <ActivityChart 
        data={activityData} 
        config={chartConfig} 
      />
    </div>
  )
}
