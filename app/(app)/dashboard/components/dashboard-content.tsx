"use client"

import { CalendarDays } from "lucide-react"
import { DashboardTabs } from './sub-components/dashboard-tabs'
import { User } from '@supabase/supabase-js'
import { Food } from '../../health/nutrition/types'

interface DashboardContentProps {
  user: User
  initialData: {
    healthRecords: any[]
    nutritionLogs: any[]
    stravaActivities: any[]
    reports: any[]
    sensorData: any[]
    consumedFoods: Food[]
  }
}

export function DashboardContent({ user, initialData }: DashboardContentProps) {
  const { healthRecords, nutritionLogs, stravaActivities, reports, sensorData, consumedFoods } = initialData

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <CalendarDays className="h-4 w-4" />
              <span className="text-sm text-muted-foreground">
                Last 30 Days Overview
              </span>
            </div>
            <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium">
              Download
            </button>
          </div>
        </div>

        <DashboardTabs 
          healthRecords={healthRecords}
          nutritionLogs={nutritionLogs}
          stravaActivities={stravaActivities}
          reports={reports}
          sensorData={sensorData}
          consumedFoods={consumedFoods}
        />
      </div>
    </div>
  )
} 