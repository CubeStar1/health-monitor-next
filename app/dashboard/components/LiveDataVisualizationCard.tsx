import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart } from "lucide-react"
import Link from 'next/link'
import { Button } from "@/components/ui/button"

export function LiveDataVisualizationCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">Live Data Visualization</CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <LineChart className="h-5 w-5" />
            <span className="text-sm sm:text-base">View health data in real-time</span>
          </div>
          <Button variant="link" asChild className="text-sm sm:text-base">
            <Link href="/health-monitor">View Charts →</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}