import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { TrendingUp } from "lucide-react"
import { Activity } from "@/app/(app)/health/activities/types"

interface ActivityChartProps {
  data: Activity[]
  config: ChartConfig
}

const chartConfig = {
  run: {
    label: "Run",
    color: "hsl(var(--chart-1))",
  },
  ride: {
    label: "Ride",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function ActivityChart({ data, config }: ActivityChartProps) {
  // Sort activities by date (newest first) and take last 6
  const recentActivities = [...data]
    .sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime())
    .slice(0, 6)

  // Process data to group by date and activity type
  const chartData = recentActivities.reduce((acc: any[], activity) => {
    const date = new Date(activity.start_date).toLocaleDateString('en-US', { 
      month: 'numeric',
      day: 'numeric'
    })
    
    const existingDay = acc.find(item => item.date === date)
    if (existingDay) {
      if (activity.type === 'Run') existingDay.run = activity.distance / 1000
      if (activity.type === 'Ride') existingDay.ride = activity.distance / 1000
    } else {
      acc.push({
        date,
        run: activity.type === 'Run' ? activity.distance / 1000 : 0,
        ride: activity.type === 'Ride' ? activity.distance / 1000 : 0
      })
    }
    return acc
  }, []).reverse() // Reverse to show oldest to newest

  const totalDistance = Math.round(data.reduce((sum, d) => sum + d.distance / 1000, 0))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Recent Activities</CardTitle>
        <CardDescription>Distance covered by type</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" aspect={1.5}>
            <BarChart data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => `${value}km`}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dashed" />}
              />
              <Bar 
                dataKey="run" 
                fill={chartConfig.run.color} 
                radius={4} 
                name="Run"
              />
              <Bar 
                dataKey="ride" 
                fill={chartConfig.ride.color} 
                radius={4} 
                name="Ride"
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Total {totalDistance}km this period
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Combined running and cycling distance
        </div>
      </CardFooter>
    </Card>
  )
} 