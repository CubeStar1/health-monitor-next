'use client'

import { useState, useEffect } from 'react'
import { createSupabaseBrowser } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronRight } from 'lucide-react'
import { HealthChart } from './components/charts'
import { Sidebar } from './components/monitor-sidebar'

interface HealthData {
  id: number;
  created_at: string;
  beat_avg: number;
  ir_value: number;
  humidity: number;
  temperature_c: number;
  temperature_f: number;
  heat_index_c: number;
  heat_index_f: number;
}

export default function HealthMonitor() {
  const [healthData, setHealthData] = useState<HealthData[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [chartType, setChartType] = useState<'area' | 'line'>('area');
  const supabase = createSupabaseBrowser();

  const startStreaming = () => {
    if (!isStreaming) {
      setIsStreaming(true);
      fetchInitialData();
    }
  };

  const stopStreaming = () => {
    if (isStreaming) {
      setIsStreaming(false);
    }
  };

  const fetchInitialData = async () => {
    const { data, error } = await supabase
      .from('sensor_data')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
    
    if (error) {
      console.error('Error fetching data:', error);
      return;
    }

    setHealthData(data.reverse());
  };

  useEffect(() => {
    const channel = supabase
      .channel('sensor_data')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'sensor_data',
        },
        (payload) => {
          if (isStreaming) {
            setHealthData(prevData => {
              const newData = [...prevData, payload.new as HealthData];
              return newData.slice(-100); // Keep only last 100 records
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, isStreaming]);

  return (
    <div className="flex h-[calc(100vh-120px)] overflow-hidden gap-4">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        isStreaming={isStreaming}
        startStreaming={startStreaming}
        stopStreaming={stopStreaming}
        chartType={chartType}
        setChartType={setChartType}
      />

      <div className="flex-grow overflow-hidden">
        <Card className="h-full flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Health Monitor</CardTitle>
            {!isSidebarOpen && (
              <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </CardHeader>
          <CardContent className="flex-grow overflow-hidden">
            <ScrollArea className="h-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <HealthChart data={healthData} dataKey="beat_avg" title="Heart Rate" unit="bpm" chartType={chartType} />
                <HealthChart data={healthData} dataKey="temperature_c" title="Temperature" unit="°C" chartType={chartType} />
                <HealthChart data={healthData} dataKey="ir_value" title="ECG Value" unit="" chartType={chartType} />
                <HealthChart data={healthData} dataKey="humidity" title="Humidity" unit="%" chartType={chartType} />
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Raw Data</CardTitle>
                  <CardDescription>Latest health measurements</CardDescription>
                </CardHeader>
                <CardContent>
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
                      {healthData.slice(-10).reverse().map((data) => (
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
                </CardContent>
              </Card>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}