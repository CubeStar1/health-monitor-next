// c:\Users\avina\Projects\RVCE\2024\health-monitor\app\(app)\health\activities\page.tsx
"use client"

import { useState, useEffect } from 'react'
import { createSupabaseBrowser } from "@/lib/supabase/client"
import { Activity } from './types'
import StravaConnect from './components/strava-connect'
import { Skeleton } from "@/components/ui/skeleton"
import { Footprints, ListChecks, Settings2, List, LayoutGrid, RefreshCw } from 'lucide-react' // Added List, LayoutGrid, RefreshCw
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ActivityTable from './components/activity-table' 
import ActivityCardGrid from './components/activity-card-grid' 
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group" 
import { Button } from '@/components/ui/button' 

function LoadingSkeleton() {
  return (
    <div className="space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-9 w-24" />
      </div>
      <Skeleton className="h-10 w-full md:w-1/2" /> 
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-60 rounded-xl" />
        ))}
      </div>
    </div>
  )
}

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isStravaConnected, setIsStravaConnected] = useState(false)
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card') // Default to card view

  const fetchActivitiesAndStatus = async () => {
    setLoading(true);
    setError(null);
    const supabase = createSupabaseBrowser()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      const { data: stravaToken, error: tokenError } = await supabase
        .from('strava_tokens')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle()

      if (tokenError) {
        console.error('Error checking Strava token:', tokenError)
        // Potentially set an error state here if critical
      }

      if (stravaToken) {
        setIsStravaConnected(true)
        try {
          const response = await fetch('/api/strava/activities')
          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || `Failed to fetch activities (status: ${response.status})`)
          }
          const data = await response.json()
          setActivities(data.sort((a: Activity, b: Activity) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime())); // Sort by newest first
        } catch (e: any) {
          setError(e.message)
          console.error("Error fetching activities:", e)
          setActivities([]) 
        }
      } else {
        setIsStravaConnected(false)
        setActivities([]) 
      }
    } else {
      setError('You must be logged in to view activities.')
      setActivities([])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchActivitiesAndStatus()
  }, [])

  const handleStravaConnectSuccess = () => {
    setIsStravaConnected(true);
    fetchActivitiesAndStatus(); // Fetch activities immediately after connection
  }
  
  const initialLoading = loading && activities.length === 0;

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {initialLoading ? (
        <LoadingSkeleton />
      ) : (
        <>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 mb-6">
            <h2 className="text-3xl font-bold tracking-tight flex items-center">
              <Footprints className="h-8 w-8 mr-3 text-primary" /> Activities
            </h2>
            {isStravaConnected && (
              <Button onClick={fetchActivitiesAndStatus} variant="outline" size="sm" disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loading && activities.length > 0 ? 'animate-spin' : ''}`} />
                {loading && activities.length > 0 ? "Refreshing..." : "Refresh Activities"}
              </Button>
            )}
          </div>

          <Tabs defaultValue="my_activities" className="space-y-4">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="my_activities">
                <ListChecks className="h-4 w-4 mr-2" /> <span>My Activities</span>
              </TabsTrigger>
              <TabsTrigger value="connected_apps">
                <Settings2 className="h-4 w-4 mr-2" /> <span>Connected Apps</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="my_activities" className="space-y-6">
              {isStravaConnected && activities.length > 0 && !error && (
                <div className="flex justify-end">
                  <ToggleGroup 
                    type="single" 
                    defaultValue={viewMode} 
                    onValueChange={(value) => { if (value) setViewMode(value as 'table' | 'card')}}
                    aria-label="View mode"
                    className="bg-background border rounded-md"
                  >
                    <ToggleGroupItem value="card" aria-label="Card view" className="data-[state=on]:bg-primary/20">
                      <LayoutGrid className="h-5 w-5" />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="table" aria-label="Table view" className="data-[state=on]:bg-primary/20">
                      <List className="h-5 w-5" />
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
              )}

              {error && (
                <div className="p-4 rounded-md bg-destructive/15 border border-destructive text-destructive-foreground">
                  <h3 className="font-semibold">Error Loading Activities</h3>
                  <p>{error}</p>
                  {error.includes("token") && <p className="mt-2 text-sm">Please try disconnecting and reconnecting your Strava account from the &apos;Connected Apps&apos; tab.</p>}
                </div>
              )}

              {!error && isStravaConnected && activities.length > 0 && (
                viewMode === 'table' 
                  ? <ActivityTable activities={activities} /> 
                  : <ActivityCardGrid activities={activities} />
              )}
              
              {!error && isStravaConnected && activities.length === 0 && !loading && (
                <div className="p-6 rounded-lg border bg-card text-card-foreground shadow-sm text-center">
                  <h3 className="text-xl font-semibold mb-2">No Activities Found</h3>
                  <p className="mb-4 text-muted-foreground">We couldn&apos;t find any recent activities. Try refreshing, or check your Strava profile. <br/>If you&apos;ve just connected, it might take a few moments for activities to appear.</p>
                  <Button onClick={fetchActivitiesAndStatus} variant="outline" disabled={loading}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    {loading ? "Checking..." : "Check Again"}
                  </Button>
                </div>
              )}

              {!error && !isStravaConnected && !loading && (
                <div className="p-6 rounded-lg border bg-card text-card-foreground shadow-sm text-center">
                  <h3 className="text-xl font-semibold mb-2">Connect to Strava</h3>
                  <p className="mb-4 text-muted-foreground">Link your Strava account to automatically sync and view your activities here.</p>
                  <StravaConnect onConnect={handleStravaConnectSuccess} />
                </div>
              )}
              
              {loading && activities.length > 0 && !initialLoading && ( 
                <div className="text-center py-8 text-muted-foreground flex items-center justify-center">
                  <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                  <span>Loading more activities...</span>
                </div>
              )}
            </TabsContent>

            <TabsContent value="connected_apps" className="space-y-4">
              <div className="p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
                <h3 className="text-xl font-semibold mb-3">Strava Integration</h3>
                {isStravaConnected ? (
                  <>
                    <p className="text-green-600 dark:text-green-400 mb-3">Your Strava account is connected.</p>
                    <p className="text-sm text-muted-foreground">You can manage your connection or view your profile on Strava.</p>
                    {/* Optionally, add a disconnect button here in the future */}
                  </>
                ) : (
                  <>
                    <p className="mb-4 text-muted-foreground">Connect your Strava account to automatically sync your activities.</p>
                    <StravaConnect onConnect={handleStravaConnectSuccess} />
                  </>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}