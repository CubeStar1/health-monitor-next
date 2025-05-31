/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { MonthlyNutritionSummary, DailyCalorieSummary, FoodFrequencySummary, FoodCalorieSummary } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, CalendarDays, Flame, Beef, Wheat, Droplets } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface MonthlyNutritionViewProps {
  data: MonthlyNutritionSummary | null;
  isLoading: boolean;
  error: Error | null;
  onMonthChange: (month: number, year: number) => void;
  currentMonth: number; // 1-12
  currentYear: number;
}

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// Define chartConfig similar to weekly-nutrition-view or import from a shared location
const chartConfig = {
  calories: { label: "Calories", color: "hsl(var(--chart-1))" },
  protein: { label: "Protein", color: "hsl(var(--chart-2))" },
  carbs: { label: "Carbs", color: "hsl(var(--chart-3))" },
  fat: { label: "Fat", color: "hsl(var(--chart-4))" },
  count: { label: "Count", color: "hsl(var(--chart-5))" },
} satisfies ChartConfig;

const barColorPalette = [
  chartConfig.calories.color,
  chartConfig.protein.color,
  chartConfig.carbs.color,
  chartConfig.fat.color,
  chartConfig.count.color,
];

const LoadingSkeletons = () => (
  <div className="space-y-6">
    <div className="flex space-x-2 mb-4">
      <Skeleton className="h-10 w-32" />
      <Skeleton className="h-10 w-24" />
    </div>
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-1/2 mb-2" />
        <Skeleton className="h-4 w-1/3" />
      </CardHeader>
      <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}
      </CardContent>
    </Card>
    {[...Array(4)].map((_, i) => (
      <Card key={i}>
        <CardHeader>
          <Skeleton className="h-6 w-1/3 mb-2" />
          <Skeleton className="h-4 w-1/4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    ))}
  </div>
);

export function MonthlyNutritionView({ data, isLoading, error, onMonthChange, currentMonth, currentYear }: MonthlyNutritionViewProps) {
  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth);
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);

  useEffect(() => {
    // Update parent component when local selection changes
    // This ensures that if the component is re-rendered with new currentMonth/Year from props,
    // it reflects those, but local changes also trigger the callback.
    if (selectedMonth !== currentMonth || selectedYear !== currentYear) {
        onMonthChange(selectedMonth, selectedYear);
    }
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    // Sync local state if props change (e.g. initial load or parent forces a change)
    setSelectedMonth(currentMonth);
    setSelectedYear(currentYear);
  }, [currentMonth, currentYear]);


  const years = useMemo(() => {
    const current = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => current - i); // Last 5 years
  }, []);

  // Memoized data transformations for charts
  const dailyCalorieData = useMemo(() => {
    if (!data?.dailyBreakdown) return [];
    return data.dailyBreakdown.map(d => ({
      ...d,
      // Ensure date is in a format Recharts can parse or format it here
      // For AreaChart, XAxis type='category' might be simpler if dates are just labels
    }));
  }, [data]);

  const monthlyMacronutrientData = useMemo(() => {
    if (!data?.nutrientTotals) return [];
    return [
      { name: 'Protein', value: data.nutrientTotals.totalProtein, fill: chartConfig.protein.color },
      { name: 'Carbs', value: data.nutrientTotals.totalCarbs, fill: chartConfig.carbs.color },
      { name: 'Fat', value: data.nutrientTotals.totalFat, fill: chartConfig.fat.color },
    ];
  }, [data]);

  const topFoodsByFrequencyData = useMemo(() => {
    if (!data?.topFoodsByFrequency) return [];
    return data.topFoodsByFrequency.map((food, index) => ({
      ...food,
      fill: barColorPalette[index % barColorPalette.length],
    }));
  }, [data]);

  const topFoodsByCaloriesData = useMemo(() => {
    if (!data?.topFoodsByCalories) return [];
    return data.topFoodsByCalories.map((food, index) => ({
      ...food,
      name: food.name,
      value: food.totalCalories,
      fill: barColorPalette[index % barColorPalette.length],
    }));
  }, [data]);


  if (isLoading) {
    return <LoadingSkeletons />;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error.message || "Failed to load monthly nutrition data."}</AlertDescription>
      </Alert>
    );
  }

  if (!data) {
    return (
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <Select value={String(selectedMonth)} onValueChange={(val) => setSelectedMonth(Number(val))}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              {monthNames.map((name, index) => (
                <SelectItem key={index} value={String(index + 1)}>{name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={String(selectedYear)} onValueChange={(val) => setSelectedYear(Number(val))}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {years.map(year => (
                <SelectItem key={year} value={String(year)}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Alert>
          <CalendarDays className="h-4 w-4" />
          <AlertTitle>No Data</AlertTitle>
          <AlertDescription>No nutrition data available for the selected month.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-4">
        <Select value={String(selectedMonth)} onValueChange={(val) => setSelectedMonth(Number(val))}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent>
            {monthNames.map((name, index) => (
              <SelectItem key={index} value={String(index + 1)}>{name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={String(selectedYear)} onValueChange={(val) => setSelectedYear(Number(val))}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Select year" />
          </SelectTrigger>
          <SelectContent>
            {years.map(year => (
              <SelectItem key={year} value={String(year)}>{year}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Summary ({monthNames[data.month - 1]} {data.year})</CardTitle>
          <CardDescription>Your key nutritional metrics for the selected month.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Avg. Daily Calories", value: `${Math.round(data.averageDailyCalories)} kcal`, icon: <Flame className="h-6 w-6 mb-2" style={{ color: chartConfig.calories.color }} />, bgColor: "bg-orange-50 dark:bg-orange-900/30", borderColor: "border-orange-200 dark:border-orange-800" },
              { label: "Total Protein", value: `${Math.round(data.nutrientTotals.totalProtein)}g`, icon: <Beef className="h-6 w-6 mb-2" style={{ color: chartConfig.protein.color }} />, bgColor: "bg-blue-50 dark:bg-blue-900/30", borderColor: "border-blue-200 dark:border-blue-800" },
              { label: "Total Carbs", value: `${Math.round(data.nutrientTotals.totalCarbs)}g`, icon: <Wheat className="h-6 w-6 mb-2" style={{ color: chartConfig.carbs.color }} />, bgColor: "bg-green-50 dark:bg-green-900/30", borderColor: "border-green-200 dark:border-green-800" },
              { label: "Total Fat", value: `${Math.round(data.nutrientTotals.totalFat)}g`, icon: <Droplets className="h-6 w-6 mb-2" style={{ color: chartConfig.fat.color }} />, bgColor: "bg-purple-50 dark:bg-purple-900/30", borderColor: "border-purple-200 dark:border-purple-800" },
            ].map((metric, index) => (
              <div key={index} className={`p-4 rounded-lg flex flex-col items-center justify-center text-center border ${metric.bgColor} ${metric.borderColor}`}>
                {metric.icon}
                <p className="text-sm text-muted-foreground">{metric.label}</p>
                <p className="text-xl font-semibold">{metric.value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Calorie Trend Chart (Daily Breakdown) */}
      {dailyCalorieData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Daily Calorie Trend</CardTitle>
            <CardDescription>Calories consumed each day of the month.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyCalorieData} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value: any, index: number) => new Date(value).getDate().toString()} // Show day number
                    tickLine={false}
                    axisLine={false}
                    padding={{ left: 10, right: 10 }}
                  />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} domain={[0, 'auto']} />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent
                      indicator="dot"
                      labelFormatter={(label) => new Date(label).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      formatter={(value) => [`${Number(value).toFixed(0)} kcal`, "Calories"]}
                    />}
                  />
                  <Area
                    type="monotone"
                    dataKey="calories"
                    stroke={chartConfig.calories.color}
                    fill={chartConfig.calories.color}
                    fillOpacity={0.3}
                    strokeWidth={2}
                    dot={true}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* Monthly Macronutrient Totals Chart */}
      {monthlyMacronutrientData.length > 0 && (
         <Card>
          <CardHeader>
            <CardTitle>Monthly Macronutrient Totals</CardTitle>
            <CardDescription>Total protein, carbs, and fat for the month.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyMacronutrientData} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                  <XAxis type="number" dataKey="value" tickFormatter={(value) => `${value}g`} />
                  <YAxis type="category" dataKey="name" width={60} tickLine={false} axisLine={false} />
                  <ChartTooltip 
                    cursor={false} 
                    content={<ChartTooltipContent hideLabel indicator="dot" formatter={(value) => `${value}g`} />}
                  />
                  <Bar dataKey="value" radius={5}>
                    {monthlyMacronutrientData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill as string} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* Top Foods by Frequency */}
      {topFoodsByFrequencyData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top Foods by Frequency</CardTitle>
            <CardDescription>Most frequently consumed foods this month.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topFoodsByFrequencyData} layout="vertical" margin={{ right: 20 }}>
                  <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                  <XAxis type="number" dataKey="count" />
                  <YAxis type="category" dataKey="name" width={100} tickLine={false} axisLine={false} />
                  <ChartTooltip 
                    cursor={false} 
                    content={<ChartTooltipContent hideLabel indicator="dot" formatter={(value, name, props) => [`${props.payload.name}: ${value} times`, null]} />}
                  />
                  <Bar dataKey="count" radius={5}>
                    {topFoodsByFrequencyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill as string} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* Top Foods by Calories */}
      {topFoodsByCaloriesData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top Foods by Calories</CardTitle>
            <CardDescription>Foods contributing the most calories this month.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topFoodsByCaloriesData} layout="vertical" margin={{ right: 20 }}>
                  <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                  <XAxis type="number" dataKey="value" tickFormatter={(val) => `${val} kcal`} />
                  <YAxis type="category" dataKey="name" width={100} tickLine={false} axisLine={false} />
                  <ChartTooltip 
                    cursor={false} 
                    content={<ChartTooltipContent hideLabel indicator="dot" formatter={(value, name, props) => [`${props.payload.name}: ${value} kcal`, null]} />}
                  />
                  <Bar dataKey="value" radius={5}>
                    {topFoodsByCaloriesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill as string} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}