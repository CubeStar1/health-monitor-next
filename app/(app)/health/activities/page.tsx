"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createSupabaseBrowser } from "@/lib/supabase/client"
import { Activity } from './types'
import ActivityGrid from './components/activity-grid'
import StravaConnect from './components/strava-connect'
import { Skeleton } from "@/components/ui/skeleton"
import { Footprints } from 'lucide-react'

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Skeleton key={i} className="h-48" />
      ))}
    </div>
  )
}

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isStravaConnected, setIsStravaConnected] = useState(false)

  useEffect(() => {
    async function checkStravaConnection() {
      const supabase = createSupabaseBrowser()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data, error } = await supabase
          .from('strava_tokens')
          .select('*')
          .eq('user_id', user.id)
          .single()
        
        if (data) {
          setIsStravaConnected(true)
          fetchActivities()
        } else {
          setIsStravaConnected(false)
          setIsLoading(false)
        }
      }
    }

    checkStravaConnection()
  }, [])

  async function fetchActivities() {
    setIsLoading(true)
    try {
      const supabase = createSupabaseBrowser()
      const { data: localActivities, error: localError } = await supabase
        .from('strava_activities')
        .select('*')
        .order('start_date', { ascending: false })
        .limit(30)

      if (localActivities && localActivities.length > 0) {
        setActivities(localActivities)
      } else {
        const response = await fetch('/api/strava/activities')
        if (!response.ok) {
          throw new Error('Failed to fetch activities')
        }
        const data = await response.json()
        setActivities(data)
      }
    } catch (err) {
      setError('Failed to load activities. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  if (error) {
    return (
      <Card className="bg-red-50 border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-green-500 to-teal-600 text-white">
        <CardHeader className="py-4">
          <div className="flex items-center space-x-2">
            <Footprints className="w-6 h-6" />
            <CardTitle className="text-xl font-bold text-white drop-shadow-md">Activities</CardTitle>
          </div>
          <CardDescription className="text-white text-opacity-90 text-sm font-medium drop-shadow">
            View your recent Strava activities
          </CardDescription>
        </CardHeader>
      </Card>
      {isLoading ? (
        <LoadingSkeleton />
      ) : !isStravaConnected ? (
        <StravaConnect onConnect={() => setIsStravaConnected(true)} />
      ) : (
        <ActivityGrid activities={activities} />
      )}
    </div>
  )
}
