"use client"

import { useState, useEffect } from "react"
import { createSupabaseBrowser } from "@/lib/supabase/client"
import { Activity as StravaActivity } from "@/app/(app)/health/activities/types"

export function useStravaActivities(userId?: string) {
  const [activities, setActivities] = useState<StravaActivity[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchActivities() {
      if (!userId) return
      
      const supabase = createSupabaseBrowser()
      const { data, error } = await supabase
        .from('strava_activities')
        .select('*')
        .eq('user_id', userId)
        .order('start_date', { ascending: false })
        .limit(30)
      
      if (!error) {
        setActivities(data || [])
      }
      setIsLoading(false)
    }

    fetchActivities()
  }, [userId])

  return { activities, isLoading }
} 