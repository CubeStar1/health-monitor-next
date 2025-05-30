"use client";

import { HealthStatsCards } from "../real-time-tab-components/realtime-stats-cards";
import { HealthChart } from "../charts";
import { HealthDataTable } from "../health-data-table";
import { HealthData } from "@/lib/types/health-types";


interface RealtimeViewTabProps {
  healthData: HealthData[];
  isStreaming: boolean;
  chartType: 'area' | 'line';
}

export function RealtimeViewTab({ healthData, isStreaming, chartType }: RealtimeViewTabProps) {
  return (
    <div className="space-y-4">
      <HealthStatsCards healthData={healthData} isStreaming={isStreaming} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <HealthChart data={healthData} dataKey="beat_avg" title="Heart Rate" unit="bpm" chartType={chartType} />
        <HealthChart data={healthData} dataKey="temperature_c" title="Temperature" unit="°C" chartType={chartType} />
        <HealthChart data={healthData} dataKey="ir_value" title="ECG Value" unit="" chartType={chartType} />
        <HealthChart data={healthData} dataKey="humidity" title="Humidity" unit="%" chartType={chartType} />
      </div>
      <HealthDataTable healthData={healthData} />
    </div>
  );
}
