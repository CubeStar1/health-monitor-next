"use client"

import { useState, useEffect } from "react"
import { createSupabaseBrowser } from "@/lib/supabase/client"

export type HealthReport = {
  id: string
  status: 'pending' | 'generating' | 'completed' | 'failed'
  report_content?: string
  error_message?: string
  created_at: string
  completed_at?: string
}

export function useHealthReports(userId?: string) {
  const [reports, setReports] = useState<HealthReport[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchReports() {
      if (!userId) return
      
      const supabase = createSupabaseBrowser()
      const { data, error } = await supabase
        .from('health_reports')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5)
      
      if (!error) {
        setReports(data || [])
      }
      setIsLoading(false)
    }

    fetchReports()
  }, [userId])

  return { reports, isLoading }
} 