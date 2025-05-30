import { useState } from 'react'
import { Activity } from '../types'
import { formatDistance, formatDuration, formatElevation, formatPace } from '../utils'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { ActivityDetails } from './activity-details'
import { Heart, ArrowUp, Clock, Ruler } from 'lucide-react'

interface ActivityGridProps {
  activities: Activity[]
}

function getActivityColor(type: string): string {
  switch (type.toLowerCase()) {
    case 'run':
      return 'from-teal-300 to-cyan-300 dark:from-green-500 dark:to-teal-600'
    case 'ride':
      return 'from-teal-300 to-cyan-300 dark:from-green-500 dark:to-teal-600'
    default:
      return 'from-gray-300 to-slate-300 dark:from-gray-700 dark:to-slate-700'
  }
}

export default function ActivityGrid({ activities }: ActivityGridProps) {
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activities.map((activity) => (
          <Dialog key={activity.id}>
            <DialogTrigger asChild>
              <Card 
                className="cursor-pointer overflow-hidden"
                onClick={() => setSelectedActivity(activity)}
              >
                <CardHeader className={`bg-gradient-to-r ${getActivityColor(activity.type)} py-2`}>
                  <CardTitle className="truncate text-sm text-gray-800 dark:text-gray-200">{activity.name}</CardTitle>
                  <p className="text-xs text-gray-800 dark:text-gray-200">{new Date(activity.start_date).toLocaleDateString()}</p>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <Ruler className="w-5 h-5 mr-2 text-blue-500" />
                      <span>{formatDistance(activity.distance)}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 mr-2 text-green-500" />
                      <span>{formatDuration(activity.moving_time)}</span>
                    </div>
                    <div className="flex items-center">
                      <ArrowUp className="w-5 h-5 mr-2 text-orange-500" />
                      <span>{formatElevation(activity.total_elevation_gain)}</span>
                    </div>
                    {activity.average_heartrate && (
                      <div className="flex items-center">
                        <Heart className="w-5 h-5 mr-2 text-red-500" />
                        <span>{Math.round(activity.average_heartrate)} bpm</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 text-center">
                    <span className="text-sm font-semibold bg-green-100 dark:bg-green-800 px-2 py-1 rounded-full">
                      {activity.type}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-screen overflow-y-auto">
              {selectedActivity && <ActivityDetails activity={selectedActivity} />}
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </>
  )
}
