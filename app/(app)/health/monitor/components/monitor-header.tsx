"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Play, Square } from 'lucide-react'

interface MonitorHeaderProps {
  title: string;
  isStreaming: boolean;
  startStreaming: () => void;
  stopStreaming: () => void;
  chartType: 'area' | 'line';
  setChartType: (type: 'area' | 'line') => void;
}

export function MonitorHeader({
  title,
  isStreaming,
  startStreaming,
  stopStreaming,
  chartType,
  setChartType
}: MonitorHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b bg-card">
      <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      <div className="flex items-center space-x-4">
        <Button onClick={startStreaming} disabled={isStreaming} size="sm">
          <Play className="mr-2 h-4 w-4" /> Start Streaming
        </Button>
        <Button onClick={stopStreaming} disabled={!isStreaming} variant="outline" size="sm">
          <Square className="mr-2 h-4 w-4" /> Stop Streaming
        </Button>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Chart:</span>
          <Select value={chartType} onValueChange={(value: 'area' | 'line') => setChartType(value)}>
            <SelectTrigger id="chart-type" className="w-[130px] h-9">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="area">Area</SelectItem>
              <SelectItem value="line">Line</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
