"use client"

import { useState, useEffect } from "react"
import { createSupabaseBrowser } from "@/lib/supabase/client"

export type SensorData = {
  id: number
  created_at: string
  beat_avg: number
  temperature_c: number
  humidity: number
}

export function useSensorData(userId?: string) {
  const [data, setData] = useState<SensorData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      if (!userId) return
      
      const supabase = createSupabaseBrowser()
      const { data, error } = await supabase
        .from('sensor_data')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)
      
      if (!error) {
        setData(data || [])
      }
      setIsLoading(false)
    }

    fetchData()
  }, [userId])

  return { data, isLoading }
} 