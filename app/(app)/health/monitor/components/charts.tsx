import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts"

interface HealthChartProps {
  data: any[];
  dataKey: string;
  title: string;
  unit: string;
  chartType: 'area' | 'line';
}

export function HealthChart({ data, dataKey, title, unit, chartType }: HealthChartProps) {
  const chartConfig = {
    [dataKey]: {
      label: title,
      color: "hsl(var(--chart-1))",
    },
    "average_temperature": {
      label: "Temperature",
      color: "hsl(var(--chart-1))",
    },
    "average_ecg": {
      label: "ECG",
      color: "hsl(var(--chart-2))",
    },
    "average_spo2": {
      label: "SpO2",
      color: "hsl(var(--chart-3))",
    },
    "average_heart_rate": {
      label: "Heart Rate",
      color: "hsl(var(--chart-4))",
    },
  } satisfies ChartConfig

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

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-2 shadow-sm">
          <p className="text-sm font-medium">{formatTooltipDate(label)}</p>
          <p className="text-sm text-muted-foreground">
            {`${title}: ${payload[0].value.toFixed(2)}${unit}`}
          </p>
        </div>
      );
    }
    return null;
  };

  const commonChartProps = {
    data: data,
    margin: { top: 10, right: 30, left: 0, bottom: 0 },
    height: 300,
  };

  const commonDataComponentProps = {
    type: "monotone" as const,
    dataKey: dataKey,
    stroke: chartConfig[dataKey].color,
    fillOpacity: 0.3,
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Real-time {title.toLowerCase()} measurements</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          {chartType === 'area' ? (
            <AreaChart {...commonChartProps}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="created_at"
                tickFormatter={formatXAxis}
                interval="preserveStartEnd"
                minTickGap={50}
              />
              <YAxis />
              <ChartTooltip
                content={<CustomTooltip />}
              />
              <Area
                {...commonDataComponentProps}
                fill={chartConfig[dataKey].color}
              />
            </AreaChart>
          ) : (
            <LineChart {...commonChartProps}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="created_at"
                tickFormatter={formatXAxis}
                interval="preserveStartEnd"
                minTickGap={50}
              />
              <YAxis />
              <ChartTooltip
                content={<CustomTooltip />}
              />
              <Line
                {...commonDataComponentProps}
                fill="none"
              />
            </LineChart>
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  )
}