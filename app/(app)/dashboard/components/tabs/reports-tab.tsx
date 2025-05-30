import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ReportsTabProps {
  reports: any[]
}

export function ReportsTab({ reports }: ReportsTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Health Reports</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {reports.map((report) => (
            <div 
              key={report.id} 
              className="flex items-center p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="space-y-1">
                <p className="text-sm font-medium">{report.title}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(report.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="ml-auto text-sm text-muted-foreground">
                {report.status}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 