import { Suspense } from "react"
import { DashboardContent } from './components/dashboard-content'
import { DashboardSkeleton } from './components/dashboard-skeleton'
import { 
  getHealthRecords, 
  getNutritionLogs, 
  getStravaActivities, 
  getHealthReports,
  getSensorData,
  getConsumedFoods 
} from "./actions"
import { createSupabaseServer } from "@/lib/supabase/server"

export default async function DashboardPage() {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return <div>Please log in to view your dashboard.</div>
  }

  // Fetch initial data on the server
  const [healthRecords, nutritionLogs, stravaActivities, reports, sensorData, consumedFoods] = await Promise.all([
    getHealthRecords(user.id),
    getNutritionLogs(user.id),
    getStravaActivities(user.id),
    getHealthReports(user.id),
    getSensorData(user.id),
    getConsumedFoods(user.id)
  ])

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent 
        user={user}
        initialData={{
          healthRecords,
          nutritionLogs,
          stravaActivities,
          reports,
          sensorData,
          consumedFoods
        }}
      />
    </Suspense>
  )
}

