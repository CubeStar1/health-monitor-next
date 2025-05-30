import { Activity } from '../types'
import { formatDistance, formatDuration, formatElevation } from '../utils'

interface ActivityListProps {
  activities: Activity[]
}

export default function ActivityList({ activities }: ActivityListProps) {
  return (
    <ul className="space-y-4">
      {activities.map((activity) => (
        <li key={activity.id} className="border p-4 rounded-md">
          <h3 className="font-bold">{activity.name}</h3>
          <p>Type: {activity.type}</p>
          <p>Distance: {formatDistance(activity.distance)}</p>
          <p>Duration: {formatDuration(activity.moving_time)}</p>
          <p>Elevation Gain: {formatElevation(activity.total_elevation_gain)}</p>
          <p>Date: {new Date(activity.start_date).toLocaleDateString()}</p>
        </li>
      ))}
    </ul>
  )
}
