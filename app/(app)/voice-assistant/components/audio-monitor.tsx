import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Mic } from "lucide-react";

interface AudioMonitorProps {
  isStreaming: boolean;
}

export function AudioMonitor({ isStreaming }: AudioMonitorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Audio Monitor
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-center py-8">
        <div className="flex flex-col items-center gap-2">
          <div className="relative">
            <Mic className="h-8 w-8 text-primary animate-pulse" />
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
          </div>
          <p className="text-primary font-medium">Listening...</p>
        </div>
      </CardContent>
    </Card>
  );
} 