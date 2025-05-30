"use client"

import { useState, useEffect } from "react"
import { createSupabaseBrowser } from "@/lib/supabase/client"

export type NutritionLog = {
  id: string
  user_id: string
  date: string
  total_calories: number
}

export function useNutritionLogs(userId?: string) {
  const [logs, setLogs] = useState<NutritionLog[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchLogs() {
      if (!userId) return
      
      const supabase = createSupabaseBrowser()
      const { data, error } = await supabase
        .from('daily_nutrition')
        .select('*')
        .eq('user_id', userId)
      
      if (!error) {
        setLogs(data || [])
      }
      setIsLoading(false)
    }

    fetchLogs()
  }, [userId])

  return { logs, isLoading }
} 