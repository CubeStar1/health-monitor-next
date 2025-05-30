import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Activity, MessageSquare, Wand2, FileText } from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import { MedicalSummary } from "./medical-summary";
import { HealthRecordsViewer } from "./health-records-viewer";

export function RagPipeline() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="h-5 w-5" />
          Hybrid RAG Pipeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Sensory Data
            </div>
            <span>+</span>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Medical Records
            </div>
          </div>
          <Separator />
          <div className="flex items-center justify-between pt-2 gap-2">
            <MedicalSummary className="w-full"/>
            <HealthRecordsViewer className="w-full"/>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 