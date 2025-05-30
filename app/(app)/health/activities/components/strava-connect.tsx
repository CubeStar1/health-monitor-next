import { Button } from "@/components/ui/button"

interface StravaConnectProps {
  onConnect: () => void
}

export default function StravaConnect({ onConnect }: StravaConnectProps) {
  const handleConnect = async () => {
    window.location.href = '/api/strava/auth'
  }

  return (
    <div className="text-center">
      <p className="mb-4">Connect your Strava account to view your activities</p>
      <Button onClick={handleConnect}>Connect Strava</Button>
    </div>
  )
}
