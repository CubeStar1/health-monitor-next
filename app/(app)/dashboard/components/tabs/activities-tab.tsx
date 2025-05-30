import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ActivitiesTabProps {
  stravaActivities: any[]
}

export function ActivitiesTab({ stravaActivities }: ActivitiesTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Strava Activities</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stravaActivities.map((activity) => (
            <div 
              key={activity.id} 
              className="flex items-center p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="space-y-1">
                <p className="text-sm font-medium">{activity.name}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(activity.start_date).toLocaleDateString()}
                </p>
              </div>
              <div className="ml-auto font-medium">
                {(activity.distance / 1000).toFixed(2)}km
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 