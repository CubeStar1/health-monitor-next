"use client";

import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { DateRange } from 'react-day-picker';
import { addDays, format } from 'date-fns';
import { 
  Calendar as CalendarIcon, 
  AlertTriangle, 
  Info, 
  HeartPulse, 
  Thermometer, 
  Droplets, 
  Activity, // For ECG/ir_value
  TrendingUp, 
  TrendingDown, 
  MinusCircle,
  Zap, // Generic for other values or as a placeholder
  BarChart2, // For data points
  Sparkles // For overall card enhancement
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Label } from '@/components/ui/label';

import { useHistoricalHealthData } from '../../hooks/use-historical-health-data';
import { useCorrelationAnalysis, CorrelationResult } from '../../hooks/useCorrelationAnalysis'; 
import { HealthData } from '@/lib/types/health-types';
import { MetricSelector, availableMetrics } from '../correlation-tab-components/metric-selector';

export function CorrelationsTab() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: addDays(new Date(), -7),
    to: new Date(),
  });
  const [timeRange, setTimeRange] = useState<[number, number]>([0, 23]);
  const [selectedMetrics, setSelectedMetrics] = useState<(keyof HealthData)[]>([]);

  const { 
    data: historicalData, 
    loading: dataLoading, 
    error: dataError, 
    fetchData 
  } = useHistoricalHealthData();
  
  const { 
    correlations, 
    calculateCorrelations, 
    loading: analysisLoading, 
    error: analysisError 
  } = useCorrelationAnalysis();

  // Fetch data when date or time range changes
  useEffect(() => {
    if (date?.from && date?.to) {
      fetchData(date, timeRange);
    }
  }, [date, timeRange, fetchData]);

  const handleMetricSelectionChange = useCallback((metricKey: keyof HealthData, checked: boolean) => {
    setSelectedMetrics(prev => 
      checked ? [...prev, metricKey] : prev.filter(key => key !== metricKey)
    );
  }, []);

  const handleRunAnalysis = () => {
    if (historicalData.length === 0) {
      // Optionally show a more specific error or alert to the user
      console.warn("No data available to run correlation analysis.");
      return;
    }
    if (selectedMetrics.length < 2) {
      // Optionally show a more specific error or alert to the user
      console.warn("Please select at least two metrics to correlate.");
      return;
    }
    calculateCorrelations(historicalData, selectedMetrics);
  };

  const getCorrelationStrength = (value: number | null): string => {
    if (value === null) return 'N/A (Insufficient Data)';
    const absValue = Math.abs(value);
    if (absValue >= 0.7) return 'Strong';
    if (absValue >= 0.4) return 'Moderate';
    if (absValue >= 0.1) return 'Weak';
    return 'Very Weak / No Correlation';
  };

  const getMetricIcon = (metricKey: keyof HealthData | string): React.ReactNode => {
    switch (metricKey) {
      case 'beat_avg': return <HeartPulse className="mr-2 h-5 w-5 text-red-500" />;
      case 'temperature_c': return <Thermometer className="mr-2 h-5 w-5 text-orange-500" />;
      case 'humidity': return <Droplets className="mr-2 h-5 w-5 text-blue-500" />;
      case 'ir_value': return <Activity className="mr-2 h-5 w-5 text-purple-500" />;
      default: return <Zap className="mr-2 h-5 w-5 text-gray-500" />;
    }
  };

  const getCorrelationPresentation = (value: number | null): {
    text: string;
    colorClass: string;
    bgColorClass: string; // For badge background
    icon: React.ReactNode;
    strengthBadgeVariant: "default" | "destructive" | "secondary" | "outline";
  } => {
    if (value === null) return {
      text: 'N/A',
      colorClass: 'text-muted-foreground',
      bgColorClass: 'bg-gray-100 dark:bg-gray-700',
      icon: <MinusCircle className="h-5 w-5 text-muted-foreground" />,
      strengthBadgeVariant: 'outline'
    };

    const absValue = Math.abs(value);
    let strengthText = '';
    const strengthBadgeVariant: "default" | "destructive" | "secondary" | "outline" = 'secondary';

    if (absValue >= 0.7) strengthText = 'Strong';
    else if (absValue >= 0.4) strengthText = 'Moderate';
    else if (absValue >= 0.1) strengthText = 'Weak';
    else strengthText = 'Very Weak';

    if (value > 0) { // Positive correlation
      if (absValue >= 0.7) return { text: `${strengthText} Positive`, colorClass: 'text-green-600 dark:text-green-400', bgColorClass: 'bg-green-100 dark:bg-green-900', icon: <TrendingUp className="h-5 w-5 text-green-500" />, strengthBadgeVariant: 'default' };
      if (absValue >= 0.4) return { text: `${strengthText} Positive`, colorClass: 'text-lime-600 dark:text-lime-400', bgColorClass: 'bg-lime-100 dark:bg-lime-900', icon: <TrendingUp className="h-5 w-5 text-lime-500" />, strengthBadgeVariant: 'default' };
      return { text: `${strengthText} Positive`, colorClass: 'text-yellow-600 dark:text-yellow-400', bgColorClass: 'bg-yellow-100 dark:bg-yellow-900', icon: <TrendingUp className="h-5 w-5 text-yellow-500" />, strengthBadgeVariant: 'secondary' };
    } else { // Negative correlation or zero
      if (absValue >= 0.7) return { text: `${strengthText} Negative`, colorClass: 'text-red-600 dark:text-red-400', bgColorClass: 'bg-red-100 dark:bg-red-900', icon: <TrendingDown className="h-5 w-5 text-red-500" />, strengthBadgeVariant: 'destructive' };
      if (absValue >= 0.4) return { text: `${strengthText} Negative`, colorClass: 'text-orange-600 dark:text-orange-400', bgColorClass: 'bg-orange-100 dark:bg-orange-900', icon: <TrendingDown className="h-5 w-5 text-orange-500" />, strengthBadgeVariant: 'destructive' };
      if (value === 0 && strengthText === 'Very Weak') return { text: 'No Correlation', colorClass: 'text-gray-500 dark:text-gray-400', bgColorClass: 'bg-gray-100 dark:bg-gray-800', icon: <MinusCircle className="h-5 w-5 text-gray-500" />, strengthBadgeVariant: 'outline' };
      return { text: `${strengthText} Negative`, colorClass: 'text-amber-600 dark:text-amber-400', bgColorClass: 'bg-amber-100 dark:bg-amber-900', icon: <TrendingDown className="h-5 w-5 text-amber-500" />, strengthBadgeVariant: 'secondary' };
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configure Correlation Analysis</CardTitle>
          <CardDescription>Select the data period and the metrics you wish to correlate.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
            {/* Column 1: Date and Time Settings */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="date-picker-trigger-corr">Date Range:</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date-picker-trigger-corr"
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date?.from ? (
                        date.to ? (
                          <>{format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}</>
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
              <div className="space-y-2">
                <Label htmlFor="time-range-slider-corr">
                  Time of Day: <span className="font-semibold text-primary">{String(timeRange[0]).padStart(2, '0')}:00 - {String(timeRange[1]).padStart(2, '0')}:59</span>
                </Label>
                <Slider
                  id="time-range-slider-corr"
                  min={0}
                  max={23}
                  step={1}
                  value={timeRange}
                  onValueChange={(value) => setTimeRange(value as [number, number])}
                  className="w-full pt-2"
                />
              </div>
              {dataLoading && <div className="pt-2 text-center text-muted-foreground">Loading data for selected range...</div>}
              {dataError && <Alert variant="destructive" className="mt-4"><AlertTriangle className="h-4 w-4" /><AlertTitle>Data Error</AlertTitle><AlertDescription>{dataError.message}</AlertDescription></Alert>}
            </div>

            {/* Column 2: Metric Selector */}
            <div className="space-y-2">
              <div>
                <h3 className="text-md font-semibold">Select Metrics</h3>
                <p className="text-sm text-muted-foreground">Choose at least two metrics to correlate.</p>
              </div>
              <MetricSelector selectedMetrics={selectedMetrics} onSelectionChange={handleMetricSelectionChange} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Button 
        onClick={handleRunAnalysis} 
        disabled={dataLoading || analysisLoading || selectedMetrics.length < 2 || historicalData.length === 0}
        className="w-full py-3 text-lg font-semibold hover:bg-primary/90 transition-colors duration-150 ease-in-out"
      >
        {analysisLoading ? (
          <><Activity className="animate-spin h-5 w-5 mr-3" />Analyzing...</>
        ) : (
          'Run Correlation Analysis'
        )}
      </Button>

      {analysisError && <Alert variant="destructive"><AlertTriangle className="h-4 w-4" /><AlertTitle>Analysis Error</AlertTitle><AlertDescription>{analysisError.message}</AlertDescription></Alert>}
      
      {correlations.length > 0 && !analysisLoading && (
        <Card className="bg-gradient-to-br from-card to-secondary/30 border-primary/20 shadow-lg">
          <CardHeader className="flex flex-row items-center space-x-2 pb-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <div>
              <CardTitle className="text-xl">Correlation Insights</CardTitle>
              <CardDescription>Analysis of relationships between selected health metrics.</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {correlations.map((result, index) => {
                const metric1Label = availableMetrics.find(m => m.key === result.metric1)?.label || result.metric1;
                const metric2Label = availableMetrics.find(m => m.key === result.metric2)?.label || result.metric2;
                const presentation = getCorrelationPresentation(result.correlation);
                return (
                  <div key={index} className={`p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border ${presentation.bgColorClass} border-opacity-30 flex flex-col justify-between`}>
                    <div>
                      <div className="flex items-center text-sm font-medium text-muted-foreground mb-2">
                        {getMetricIcon(result.metric1)}
                        <span>{metric1Label}</span>
                      </div>
                      <div className="text-center text-2xl font-bold text-muted-foreground my-2">vs.</div>
                      <div className="flex items-center text-sm font-medium text-muted-foreground mb-3">
                        {getMetricIcon(result.metric2)}
                        <span>{metric2Label}</span>
                      </div>
                    </div>
                    
                    <div className="text-center mt-auto">
                      <div className={`text-3xl font-extrabold ${presentation.colorClass} mb-1 flex items-center justify-center`}>
                        {presentation.icon}
                        <span className="ml-2">{result.correlation !== null ? result.correlation.toFixed(3) : 'N/A'}</span>
                      </div>
                      <Badge variant={presentation.strengthBadgeVariant} className={`text-xs ${presentation.colorClass} border ${presentation.colorClass.replace('text-', 'border-')}/50`}>
                        {presentation.text}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-2 flex items-center justify-center">
                        <BarChart2 className="h-3 w-3 mr-1" /> {result.dataPoints} valid data points
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {correlations.length === 0 && !analysisLoading && !analysisError && selectedMetrics.length >=2 && historicalData.length > 0 && (
         <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>No Results Yet</AlertTitle>
          <AlertDescription>Click &quot;Run Correlation Analysis&quot; to see results. Ensure you have selected at least two metrics and data is available for the chosen period.</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
