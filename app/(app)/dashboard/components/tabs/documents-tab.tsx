import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface DocumentsTabProps {
  healthRecords: any[]
}

export function DocumentsTab({ healthRecords }: DocumentsTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Health Documents</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {healthRecords.map((record) => (
            <div 
              key={record.id} 
              className="flex items-center p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{record.file_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(record.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="ml-auto font-medium">{record.file_type}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 