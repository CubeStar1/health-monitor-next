import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { TrendingUp } from "lucide-react"

interface CaloriesChartProps {
  data: Array<{ date: string; calories: number }>
  config: ChartConfig
}

const chartConfig = {
  day1: {
    label: "Day 1",
    color: "hsl(var(--chart-1))",
  },
  day2: {
    label: "Day 2",
    color: "hsl(var(--chart-2))",
  },
  day3: {
    label: "Day 3",
    color: "hsl(var(--chart-3))",
  },
  day4: {
    label: "Day 4",
    color: "hsl(var(--chart-4))",
  },
  day5: {
    label: "Day 5",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig

export function CaloriesChart({ data }: CaloriesChartProps) {
  // Get last 5 days of data
  const recentData = [...data]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)
    .map((item, index) => ({
      date: new Date(item.date).toLocaleDateString('en-US', { 
        month: 'numeric',
        day: 'numeric'
      }),
      calories: item.calories,
      fill: Object.values(chartConfig)[index].color
    }))
    .reverse()

  const avgCalories = Math.round(recentData.reduce((sum, d) => sum + d.calories, 0) / recentData.length)
  const previousAvg = Math.round(data.slice(5, 10).reduce((sum, d) => sum + d.calories, 0) / 5)
  const trend = ((avgCalories - previousAvg) / previousAvg) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Daily Calories</CardTitle>
        <CardDescription>Last 5 days breakdown</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" aspect={1.5}>
            <BarChart
              data={recentData}
              layout="vertical"
              margin={{
                left: 0,
                right: 20,
              }}
            >
              <YAxis
                dataKey="date"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                fontSize={12}
              />
              <XAxis 
                type="number" 
                hide 
                domain={[0, 'auto']}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar 
                dataKey="calories" 
                radius={[0, 4, 4, 0]}
                fill={undefined}
                fillOpacity={0.9}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          {trend > 0 ? 'Up' : 'Down'} by {Math.abs(trend).toFixed(1)}% from last period
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Average {avgCalories} calories per day
        </div>
      </CardFooter>
    </Card>
  )
} 