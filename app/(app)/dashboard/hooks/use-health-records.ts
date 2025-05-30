"use client"

import { useState, useEffect } from "react"
import { createSupabaseBrowser } from "@/lib/supabase/client"

export type HealthRecord = {
  id: string
  user_id: string
  file_name: string
  file_type: string
  created_at: string
}

export function useHealthRecords(userId?: string) {
  const [records, setRecords] = useState<HealthRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchRecords() {
      if (!userId) return
      
      const supabase = createSupabaseBrowser()
      const { data, error } = await supabase
        .from('file_metadata')
        .select('*')
        .eq('user_id', userId)
      
      if (!error) {
        setRecords(data || [])
      }
      setIsLoading(false)
    }

    fetchRecords()
  }, [userId])

  return { records, isLoading }
} 