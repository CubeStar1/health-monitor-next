"use client";

import * as React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { HealthData } from '@/lib/types/health-types';

export const availableMetrics: { key: keyof HealthData; label: string }[] = [
  { key: 'beat_avg', label: 'Heart Rate (bpm)' },
  { key: 'ir_value', label: 'ECG Value' }, // Assuming ir_value is ECG
  { key: 'humidity', label: 'Humidity (%)' },
  { key: 'temperature_c', label: 'Temperature (°C)' },
  // Add other numerical metrics if available and relevant
];

interface MetricSelectorProps {
  selectedMetrics: (keyof HealthData)[];
  onSelectionChange: (metricKey: keyof HealthData, checked: boolean) => void;
}

export function MetricSelector({ selectedMetrics, onSelectionChange }: MetricSelectorProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-1">
      {availableMetrics.map((metric) => (
        <div key={metric.key} className="flex items-center space-x-2 p-2.5 border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors bg-background/50">
          <Checkbox
            id={metric.key}
            checked={selectedMetrics.includes(metric.key)}
            onCheckedChange={(checked) => onSelectionChange(metric.key, !!checked)}
          />
          <Label htmlFor={metric.key} className="text-sm font-medium leading-none cursor-pointer flex-1">
            {metric.label}
          </Label>
        </div>
      ))}
    </div>
  );
}
