"use client";

import * as React from "react";
import { useState, useEffect } from 'react';
import { DateRange } from 'react-day-picker';
import { addDays, format } from 'date-fns';
import { Calendar as CalendarIcon, HeartPulse, Thermometer, Activity, Droplets } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { HealthChart } from '../charts';
import { HistoricalStatCard } from '../historical-tab-components/historical-stat-card';
import { useHistoricalHealthData } from '../../hooks/use-historical-health-data';
import { HealthData } from '@/lib/types/health-types';

// Helper function to calculate statistics
const calculateMetricStats = (data: HealthData[], key: keyof HealthData) => {
  const values = data.map(item => item[key] as number).filter(val => val !== null && val !== undefined && !isNaN(val));
  if (values.length === 0) return { avg: 0, min: 0, max: 0, count: 0 };
  const sum = values.reduce((acc, val) => acc + val, 0);
  return {
    avg: sum / values.length,
    min: Math.min(...values),
    max: Math.max(...values),
    count: values.length
  };
};

export function HistoricalDataTab() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: addDays(new Date(), -7),
    to: new Date(),
  });
  const [timeRange, setTimeRange] = useState<[number, number]>([0, 23]); // [startHour, endHour]

  const { data: historicalData, loading, error, fetchData } = useHistoricalHealthData();

  useEffect(() => {
    if (date?.from && date?.to) {
      fetchData(date, timeRange);
    }
  }, [date, timeRange, fetchData]);

  const heartRateStats = calculateMetricStats(historicalData, 'beat_avg');
  const tempStats = calculateMetricStats(historicalData, 'temperature_c');
  const ecgStats = calculateMetricStats(historicalData, 'ir_value');
  const humidityStats = calculateMetricStats(historicalData, 'humidity');

  const statMetrics = [
    { title: "Heart Rate", stats: heartRateStats, unit: "bpm", icon: <HeartPulse className="h-5 w-5 text-white/80" />, gradient: "bg-gradient-to-br from-red-500 to-pink-500" },
    { title: "Temperature", stats: tempStats, unit: "°C", icon: <Thermometer className="h-5 w-5 text-white/80" />, gradient: "bg-gradient-to-br from-green-500 to-teal-500" },
    { title: "ECG Value", stats: ecgStats, unit: "", icon: <Activity className="h-5 w-5 text-white/80" />, gradient: "bg-gradient-to-br from-indigo-500 to-purple-600" },
    { title: "Humidity", stats: humidityStats, unit: "%", icon: <Droplets className="h-5 w-5 text-white/80" />, gradient: "bg-gradient-to-br from-blue-500 to-cyan-500" },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Select Date Range & Time</CardTitle>
          <CardDescription>Filter historical health data by date and time of day.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
          <div className="md:flex-1 space-y-2">
            <label htmlFor="date-picker-trigger" className="block text-sm font-medium text-foreground">
              Date Range:
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date-picker-trigger"
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd, y")} - {" "}
                        {format(date.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(date.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="md:flex-1 space-y-2">
            <label htmlFor="time-range-slider" className="block text-sm font-medium text-foreground">
              Time of Day: <span className="font-semibold text-primary">{String(timeRange[0]).padStart(2, '0')}:00 - {String(timeRange[1]).padStart(2, '0')}:59</span>
            </label>
            <Slider
              id="time-range-slider"
              min={0}
              max={23}
              step={1}
              value={timeRange}
              onValueChange={(value) => setTimeRange(value as [number, number])}
              className="w-full pt-2" // Added pt-2 for better alignment with button
            />
          </div>
        </CardContent>
      </Card>

      {loading && <p className="text-center text-muted-foreground">Loading historical data...</p>}
      {error && <p className="text-center text-destructive">Error fetching data: {error.message}</p>}

      {!loading && !error && historicalData.length === 0 && date?.from && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No data available for the selected period.</p>
          </CardContent>
        </Card>
      )}

      {!loading && !error && historicalData.length > 0 && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Summary Statistics</CardTitle>
              <CardDescription>Overview of health metrics for the selected period.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {statMetrics.map((metric) => (
                <HistoricalStatCard
                  key={metric.title}
                  title={metric.title}
                  stats={metric.stats}
                  unit={metric.unit}
                  icon={metric.icon}
                  gradient={metric.gradient}
                />
              ))}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <HealthChart data={historicalData} dataKey="beat_avg" title="Historical Heart Rate" unit="bpm" chartType="line" />
            <HealthChart data={historicalData} dataKey="temperature_c" title="Historical Temperature" unit="°C" chartType="line" />
            <HealthChart data={historicalData} dataKey="ir_value" title="Historical ECG Value" unit="" chartType="line" />
            <HealthChart data={historicalData} dataKey="humidity" title="Historical Humidity" unit="%" chartType="line" />
          </div>
        </>
      )}
    </div>
  );
}
