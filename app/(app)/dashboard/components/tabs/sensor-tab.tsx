import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"

interface SensorData {
  id: number
  created_at: string
  beat_avg: number
  ir_value: number
  humidity: number
  temperature_c: number
  temperature_f: number
  heat_index_c: number
  heat_index_f: number
}

interface SensorTabProps {
  sensorData: SensorData[]
}

export function SensorTab({ sensorData }: SensorTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sensor Data</CardTitle>
        <CardDescription>Latest sensor measurements</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Heart Rate (bpm)</TableHead>
                <TableHead>Temperature (°C)</TableHead>
                <TableHead>ECG Value</TableHead>
                <TableHead>Humidity (%)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sensorData.map((data) => (
                <TableRow key={data.id}>
                  <TableCell>{new Date(data.created_at).toLocaleString()}</TableCell>
                  <TableCell>{data.beat_avg?.toFixed(2) ?? 'N/A'}</TableCell>
                  <TableCell>{data.temperature_c?.toFixed(2) ?? 'N/A'}</TableCell>
                  <TableCell>{data.ir_value?.toFixed(2) ?? 'N/A'}</TableCell>
                  <TableCell>{data.humidity?.toFixed(2) ?? 'N/A'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  )
} 