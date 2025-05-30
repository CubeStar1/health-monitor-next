"use client";

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HealthData } from "@/lib/types/health-types";
import { HeartPulse, Thermometer, Activity, Droplets, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";


interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactElement<{ className?: string }>;
  description?: string;
  cardClassName?: string; // For gradient background
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, description, cardClassName }) => {
  return (
    <Card className={cn("shadow-lg hover:shadow-xl transition-all duration-200 ease-in-out hover:scale-[1.02] border-0", cardClassName)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4 px-4">
        <CardTitle className="text-sm font-semibold text-white">{title}</CardTitle>
        <div className="p-2 rounded-lg bg-white/20">
          {React.cloneElement(icon, {
            className: cn(icon.props.className, "h-5 w-5", "text-white/90")
          })}
        </div>
      </CardHeader>
      <CardContent className="pb-4 px-4">
        <div className="text-3xl font-bold text-white">{value}</div>
        {description && <p className="text-xs text-white/80 pt-1">{description}</p>}
      </CardContent>
    </Card>
  );
};

interface HealthStatsCardsProps {
  healthData: HealthData[];
  isStreaming: boolean;
}

export function HealthStatsCards({ healthData, isStreaming }: HealthStatsCardsProps) {
  const calculateAverage = (data: HealthData[], key: keyof HealthData, precision: number = 1): string => {
    if (!data || data.length === 0) return "N/A";
    const validData = data.filter(d => d[key] != null && !isNaN(Number(d[key])));
    if (validData.length === 0) return "N/A";
    const sum = validData.reduce((acc, curr) => acc + Number(curr[key]), 0);
    const average = sum / validData.length;
    return average.toFixed(precision);
  };

  const latestValue = (data: HealthData[], key: keyof HealthData, precision: number = 1): string => {
    if (!data || data.length === 0) return "N/A";
    const lastRecord = data[data.length - 1];
    const value = lastRecord?.[key];
    if (value == null || isNaN(Number(value))) return "N/A";
    return Number(value).toFixed(precision);
  }

  const cardStyles = [
    { bg: "bg-gradient-to-br from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700" },      // Heart Rate
    { bg: "bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700" },// Temperature
    { bg: "bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700" },// ECG
    { bg: "bg-gradient-to-br from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700" },        // Humidity
  ];

  const stats = [
    {
      title: "Heart Rate",
      value: latestValue(healthData, 'beat_avg', 0) + " bpm",
      icon: <HeartPulse />,
      description: `Avg: ${calculateAverage(healthData, 'beat_avg', 0)} bpm`,
      cardClassName: cardStyles[0].bg,
    },
    {
      title: "Temperature",
      value: latestValue(healthData, 'temperature_c', 1) + " °C",
      icon: <Thermometer />,
      description: `Avg: ${calculateAverage(healthData, 'temperature_c', 1)} °C`,
      cardClassName: cardStyles[1].bg,
    },
    {
      title: "ECG Value", // Assuming ir_value is ECG
      value: latestValue(healthData, 'ir_value', 0),
      icon: <Activity />,
      description: `Avg: ${calculateAverage(healthData, 'ir_value', 0)}`,
      cardClassName: cardStyles[2].bg,
    },
    {
      title: "Humidity",
      value: latestValue(healthData, 'humidity', 1) + " %",
      icon: <Droplets />,
      description: `Avg: ${calculateAverage(healthData, 'humidity', 1)} %`,
      cardClassName: cardStyles[3].bg,
    },
  ];

  if (!isStreaming && healthData.length === 0) {
    return (
      <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className={cn("shadow-lg border-0", cardStyles[i].bg)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4 px-4">
              <div className="h-4 w-24 bg-white/30 rounded" />
              <div className="p-2 rounded-lg bg-white/20">
                <Loader2 className="h-5 w-5 text-white/90 animate-spin" />
              </div>
            </CardHeader>
            <CardContent className="pb-4 px-4">
              <div className="h-8 w-16 bg-white/30 rounded mb-2" />
              <div className="h-3 w-20 bg-white/30 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  return (
    <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-4">
      {stats.map((stat) => (
        <StatCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          description={stat.description}
          cardClassName={stat.cardClassName}
        />
      ))}
    </div>
  );
}
