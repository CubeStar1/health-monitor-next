import { Activity, Apple, FileText, Heart } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface StatsCardProps {
  title: string
  value: string
  description: string
  icon: React.ReactNode
  className?: string
}

interface StatsCardsProps {
  healthRecords: any[]
  nutritionLogs: any[]
  stravaActivities: any[]
  reports: any[]
}

function StatsCard({ title, value, description, icon, className }: StatsCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

export function StatsCards({ healthRecords, nutritionLogs, stravaActivities, reports }: StatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Health Records"
        value={healthRecords.length.toString()}
        description="Total records uploaded"
        icon={<FileText className="h-4 w-4 text-[hsl(var(--chart-1))]" />}
        className="bg-[hsl(var(--chart-1)_/_0.4)] hover:bg-[hsl(var(--chart-1)_/_0.15)] transition-colors dark:bg-[hsl(var(--chart-1)_/_0.4)] dark:hover:bg-[hsl(var(--chart-1)_/_0.2)]"
      />
      <StatsCard
        title="Nutrition Logs"
        value={nutritionLogs.length.toString()}
        description={`${nutritionLogs.filter(l => new Date(l.date).toDateString() === new Date().toDateString()).length} entries today`}
        icon={<Apple className="h-4 w-4 text-[hsl(var(--chart-2))]" />}
        className="bg-[hsl(var(--chart-2)_/_0.4)] hover:bg-[hsl(var(--chart-2)_/_0.15)] transition-colors dark:bg-[hsl(var(--chart-2)_/_0.15)] dark:hover:bg-[hsl(var(--chart-2)_/_0.2)]"
      />
      <StatsCard
        title="Activities"
        value={stravaActivities.length.toString()}
        description={`${stravaActivities.filter(a => new Date(a.start_date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length} in last 7 days`}
        icon={<Activity className="h-4 w-4 text-[hsl(var(--chart-3))]" />}
        className="bg-[hsl(var(--chart-3)_/_0.4)] hover:bg-[hsl(var(--chart-3)_/_0.15)] transition-colors dark:bg-[hsl(var(--chart-3)_/_0.15)] dark:hover:bg-[hsl(var(--chart-3)_/_0.2)]"
      />
      <StatsCard
        title="Reports"
        value={reports.length.toString()}
        description={`${reports.filter(r => r.status === 'completed').length} completed`}
        icon={<Heart className="h-4 w-4 text-[hsl(var(--chart-4))]" />}
        className="bg-[hsl(var(--chart-4)_/_0.4)] hover:bg-[hsl(var(--chart-4)_/_0.15)] transition-colors dark:bg-[hsl(var(--chart-4)_/_0.15)] dark:hover:bg-[hsl(var(--chart-4)_/_0.2)]"
      />
    </div>
  )
} 