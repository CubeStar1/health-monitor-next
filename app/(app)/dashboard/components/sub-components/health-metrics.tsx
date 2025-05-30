import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface MetricProps {
  title: string
  value: number | string
  unit: string
  change?: number
  timeframe?: string
}

function MetricCard({ title, value, unit, change, timeframe }: MetricProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {change && (
          <span className={`text-xs ${change > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {change > 0 ? '↑' : '↓'} {Math.abs(change)}%
          </span>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {value}
          <span className="text-sm font-normal text-muted-foreground ml-1">{unit}</span>
        </div>
        {timeframe && (
          <p className="text-xs text-muted-foreground mt-1">{timeframe}</p>
        )}
      </CardContent>
    </Card>
  )
}

export function HealthMetrics({ sensorData }: { sensorData: any[] }) {
  const latest = sensorData[0] || {}
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Heart Rate"
        value={latest.beat_avg?.toFixed(0) || "0"}
        unit="bpm"
        change={4.51}
        timeframe="Last reading"
      />
      <MetricCard
        title="Temperature"
        value={latest.temperature_c?.toFixed(1) || "0"}
        unit="°C"
        timeframe="Current"
      />
      <MetricCard
        title="Humidity"
        value={latest.humidity?.toFixed(1) || "0"}
        unit="%"
        timeframe="Room condition"
      />
      <MetricCard
        title="Heat Index"
        value={latest.heat_index_c?.toFixed(1) || "0"}
        unit="°C"
        timeframe="Feels like"
      />
    </div>
  )
} 