import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"

interface TemperatureChartProps {
  data: Array<{ time: string; temp: number; humidity: number }>
}

const chartConfig = {
  temperature: {
    label: "Temperature",
    color: "hsl(var(--chart-1))",
  },
  humidity: {
    label: "Humidity",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function TemperatureChart({ data }: TemperatureChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Temperature</CardTitle>
        <CardDescription>Room conditions</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
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
                yAxisId="left"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                domain={[0, 30]}
                ticks={[0, 10, 20, 30]}
                width={30}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                domain={[0, 100]}
                ticks={[0, 25, 50, 75, 100]}
                width={30}
              />
              <ChartTooltip 
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Line 
                yAxisId="left"
                type="monotone"
                dataKey="temp"
                stroke={chartConfig.temperature.color}
                strokeWidth={2}
                dot={false}
              />
              <Line 
                yAxisId="right"
                type="monotone"
                dataKey="humidity"
                stroke={chartConfig.humidity.color}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Current: {data[0]?.temp.toFixed(1)}°C, {data[0]?.humidity.toFixed(1)}% RH
        </div>
        <div className="leading-none text-muted-foreground">
          Temperature and humidity trends
        </div>
      </CardFooter>
    </Card>
  )
} 