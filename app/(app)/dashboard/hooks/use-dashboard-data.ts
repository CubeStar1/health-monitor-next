"use client"

import { useState, useEffect } from "react"
import useUser from "@/hooks/use-user"
import { 
  getHealthRecords, 
  getNutritionLogs, 
  getStravaActivities, 
  getHealthReports,
  getSensorData 
} from "../actions"

export function useDashboardData() {
  const { data: user, isLoading: userLoading } = useUser()
  const [healthRecords, setHealthRecords] = useState<any[]>([])
  const [nutritionLogs, setNutritionLogs] = useState<any[]>([])
  const [stravaActivities, setStravaActivities] = useState<any[]>([])
  const [reports, setReports] = useState<any[]>([])
  const [sensorData, setSensorData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      if (!user?.id) return

      try {
        const [records, logs, activities, reportData, sensor] = await Promise.all([
          getHealthRecords(user.id),
          getNutritionLogs(user.id),
          getStravaActivities(user.id),
          getHealthReports(user.id),
          getSensorData(user.id)
        ])

        setHealthRecords(records)
        setNutritionLogs(logs)
        setStravaActivities(activities)
        setReports(reportData)
        setSensorData(sensor)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (!userLoading) {
      fetchData()
    }
  }, [user?.id, userLoading])

  return {
    user,
    healthRecords,
    nutritionLogs,
    stravaActivities,
    reports,
    sensorData,
    isLoading: userLoading || isLoading
  }
} 