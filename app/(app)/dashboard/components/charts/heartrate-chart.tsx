import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { TrendingUp } from "lucide-react"

interface HeartRateChartProps {
  data: Array<{ time: string; value: number }>
  config: ChartConfig
}

export function HeartRateChart({ data, config }: HeartRateChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Heart Rate</CardTitle>
        <CardDescription>Last hour measurements</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config}>
          <ResponsiveContainer width="100%" aspect={1.5}>
            <LineChart 
              data={data}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis 
                dataKey="time" 
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 5)}
              />
              <YAxis 
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <ChartTooltip 
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Line 
                type="monotone"
                dataKey="value"
                stroke={config.heartRate.color}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Average {Math.round(data.reduce((sum, d) => sum + d.value, 0) / data.length)} BPM
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Real-time heart rate monitoring
        </div>
      </CardFooter>
    </Card>
  )
} 