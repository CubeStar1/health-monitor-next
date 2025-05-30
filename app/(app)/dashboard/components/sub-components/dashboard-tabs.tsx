"use client"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { OverviewTab } from '../tabs/overview-tab'
import { DocumentsTab } from '../tabs/documents-tab'
import { ActivitiesTab } from '../tabs/activities-tab'
import { HealthProfileTab } from '../tabs/health-profile-tab'
import { SensorTab } from '../tabs/sensor-tab'
import { Food } from '@/app/(app)/health/nutrition/types'

interface DashboardTabsProps {
  healthRecords: any[]
  nutritionLogs: any[]
  stravaActivities: any[]
  reports: any[]
  sensorData: any[]
  consumedFoods: Food[]
}

export function DashboardTabs({ 
  healthRecords, 
  nutritionLogs, 
  stravaActivities,
  reports,
  sensorData,
  consumedFoods
}: DashboardTabsProps) {
  return (
    <Tabs defaultValue="overview" className="space-y-8">
      <div className="border-b">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="sensors">Sensors</TabsTrigger>
          <TabsTrigger value="profile">Health Profile</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="overview">
        <OverviewTab 
          healthRecords={healthRecords}
          nutritionLogs={nutritionLogs}
          stravaActivities={stravaActivities}
          reports={reports}
          sensorData={sensorData}
          consumedFoods={consumedFoods}
        />
      </TabsContent>

      <TabsContent value="documents">
        <DocumentsTab healthRecords={healthRecords} />
      </TabsContent>

      <TabsContent value="activities">
        <ActivitiesTab stravaActivities={stravaActivities} />
      </TabsContent>

      <TabsContent value="sensors">
        <SensorTab sensorData={sensorData} />
      </TabsContent>

      <TabsContent value="profile">
        <HealthProfileTab />
      </TabsContent>
    </Tabs>
  )
} 