"use client"

import React, { useEffect, useState } from "react"
import { Activity, DetailedActivity } from '../types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"
import { formatDistance, formatDuration, formatElevation, formatPace } from '../utils'
import { Skeleton } from "@/components/ui/skeleton"

interface ActivityDetailsProps {
  activity: Activity
}

export function ActivityDetails({ activity }: ActivityDetailsProps) {
  const [detailedActivity, setDetailedActivity] = useState<DetailedActivity | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchDetailedActivity() {
      try {
        const response = await fetch(`/api/strava/activities/${activity.id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch detailed activity')
        }
        const data = await response.json()
        setDetailedActivity(data)
      } catch (error) {
        console.error('Error fetching detailed activity:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDetailedActivity()
  }, [activity.id])

  const chartConfig: ChartConfig = {
    pace: { label: "Pace", color: "hsl(var(--chart-1))" },
    elevation: { label: "Elevation", color: "hsl(var(--chart-2))" },
    heartrate: { label: "Heart Rate", color: "hsl(var(--chart-3))" },
  }

  if (isLoading) {
    return <Skeleton className="w-full h-[600px]" />
  }

  if (!detailedActivity) {
    return <div>Failed to load detailed activity data.</div>
  }

  const paceData = detailedActivity.splits_metric.map((split, index) => ({
    kilometer: index + 1,
    pace: 1000 / split.average_speed,
  }))

  const elevationData = detailedActivity.splits_metric.map((split, index) => ({
    kilometer: index + 1,
    elevation: split.elevation_difference,
  }))

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{activity.name}</CardTitle>
          <CardDescription>{new Date(activity.start_date).toLocaleDateString()}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p>Type: {activity.type}</p>
              <p>Distance: {formatDistance(activity.distance)}</p>
              <p>Duration: {formatDuration(activity.moving_time)}</p>
            </div>
            <div>
              <p>Elevation Gain: {formatElevation(activity.total_elevation_gain)}</p>
              <p>Average Pace: {formatPace(activity.average_speed)}</p>
              {activity.average_heartrate && <p>Avg Heart Rate: {Math.round(activity.average_heartrate)} bpm</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Pace Over Distance</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <AreaChart data={paceData} height={300}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="kilometer" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="pace" stroke={chartConfig.pace.color} fill={chartConfig.pace.color} fillOpacity={0.3} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Elevation Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <AreaChart data={elevationData} height={300}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="kilometer" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="elevation" stroke={chartConfig.elevation.color} fill={chartConfig.elevation.color} fillOpacity={0.3} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {activity.average_heartrate && (
        <Card>
          <CardHeader>
            <CardTitle>Heart Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <BarChart data={[{ heartrate: activity.average_heartrate }]} height={300}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="heartrate" fill={chartConfig.heartrate.color} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
