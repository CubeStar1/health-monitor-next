import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronLeft, Play, Square } from 'lucide-react'

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  isStreaming: boolean;
  startStreaming: () => void;
  stopStreaming: () => void;
  chartType: 'area' | 'line';
  setChartType: (type: 'area' | 'line') => void;
}

export function Sidebar({
  isSidebarOpen,
  setIsSidebarOpen,
  isStreaming,
  startStreaming,
  stopStreaming,
  chartType,
  setChartType
}: SidebarProps) {
  return (
    <ScrollArea className={`${isSidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 ease-in-out overflow-y-auto flex-shrink-0`}>
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Controls</CardTitle>
          <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-4">
            <Button onClick={startStreaming} disabled={isStreaming} className="w-full">
              <Play className="mr-2 h-4 w-4" /> Start Streaming
            </Button>
            <Button onClick={stopStreaming} disabled={!isStreaming} className="w-full">
              <Square className="mr-2 h-4 w-4" /> Stop Streaming
            </Button>
            <div>
              <label htmlFor="chart-type" className="block text-sm font-medium text-gray-700 mb-1">
                Chart Type
              </label>
              <Select value={chartType} onValueChange={(value: 'area' | 'line') => setChartType(value)}>
                <SelectTrigger id="chart-type">
                  <SelectValue placeholder="Select chart type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="area">Area Chart</SelectItem>
                  <SelectItem value="line">Line Chart</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </ScrollArea>
  )
}