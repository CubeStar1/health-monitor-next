"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface SendHealthReportDisplayProps {
  data: {
    success: boolean;
    message?: string;
    error?: string;
  };
}

export function SendHealthReportDisplay({ data }: SendHealthReportDisplayProps) {
  if (data.success) {
    return (
      <Alert variant="default" className="bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-500/30">
        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
        <AlertTitle className="text-emerald-800 dark:text-emerald-200">Report Sent Successfully</AlertTitle>
        <AlertDescription className="text-emerald-700 dark:text-emerald-300">
          {data.message || 'The health report has been sent to the specified email address.'}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Failed to Send Report</AlertTitle>
      <AlertDescription>
        {data.error || 'An unknown error occurred while sending the health report.'}
      </AlertDescription>
    </Alert>
  );
}
