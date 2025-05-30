import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, Line, LineChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { HealthData } from "@/lib/types/health-types";

interface HealthChartProps {
  data: HealthData[];
  dataKey: string;
  title: string;
  unit: string;
  chartType: 'area' | 'line';
}

const baseChartConfig = {
  beat_avg: { label: "Heart Rate", color: "hsl(340 75% 55%)" },
  temperature_c: { label: "Temperature", color: "hsl(150, 70%, 60%)" },
  ir_value: { label: "ECG Value", color: "hsl(280, 60%, 65%)" }, 
  humidity: { label: "Humidity", color: "hsl(20, 80%, 65%)" },
} satisfies ChartConfig;

export function HealthChart({ data, dataKey, title, unit, chartType }: HealthChartProps) {
  const chartConfig = {
    [dataKey]: {
      label: title,
      color: baseChartConfig[dataKey as keyof typeof baseChartConfig]?.color || "hsl(var(--chart-1))", // Use specific color or fallback
    },
  } satisfies ChartConfig;

  const formatXAxis = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatTooltipDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const commonChartProps = {
    data: data,
    margin: { top: 5, right: 10, left: -20, bottom: 0 }, // Adjusted margins
  };

  const commonDataComponentProps = {
    type: "monotone" as const,
    dataKey: dataKey,
    stroke: chartConfig[dataKey].color,
    fillOpacity: 0.3,
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <CardDescription>Real-time {title.toLowerCase()} measurements {unit ? `(${unit})` : ''}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow pb-4">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'area' ? (
              <AreaChart {...commonChartProps}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="created_at"
                  tickFormatter={formatXAxis}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  interval="preserveStartEnd"
                  minTickGap={40}
                />
                <YAxis 
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  domain={[0, 'auto']}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent 
                    indicator="dot"
                    labelFormatter={formatTooltipDate} 
                    formatter={(value, name, props) => [`${Number(value).toFixed(2)} ${unit}`, title]}
                  />}
                />
                <Area
                  {...commonDataComponentProps}
                  fill={chartConfig[dataKey].color}
                  strokeWidth={2}
                  dot={false}
                />
              </AreaChart>
            ) : (
              <LineChart {...commonChartProps}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="created_at"
                  tickFormatter={formatXAxis}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  interval="preserveStartEnd"
                  minTickGap={40}
                />
                <YAxis 
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  domain={['auto', 'auto']}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent 
                    indicator="line"
                    labelFormatter={formatTooltipDate}
                    formatter={(value, name, props) => [`${Number(value).toFixed(2)} ${unit}`, title]}
                  />}
                />
                <Line
                  {...commonDataComponentProps}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}