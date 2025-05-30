"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area";
import { HealthData } from "@/lib/types/health-types";


interface HealthDataTableProps {
  healthData: HealthData[];
}

export function HealthDataTable({ healthData }: HealthDataTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Raw Data</CardTitle>
        <CardDescription>Latest health measurements</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Heart Rate (bpm)</TableHead>
                <TableHead>Temperature (°C)</TableHead>
                <TableHead>IR Value</TableHead>
                <TableHead>Humidity (%)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {healthData.slice(-20).reverse().map((data) => (
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
  );
}
