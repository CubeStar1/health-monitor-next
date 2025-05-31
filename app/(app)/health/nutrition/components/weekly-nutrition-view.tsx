"use client";

import React from 'react';
import { WeeklyNutritionSummary, DailyCalorieSummary } from "../types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Flame, Beef, Wheat, Droplets } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface WeeklyNutritionViewProps {
  data: WeeklyNutritionSummary | null;
  isLoading: boolean;
  error: Error | null;
}

const chartConfig: ChartConfig = {
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

export function WeeklyNutritionView({ data, isLoading, error }: WeeklyNutritionViewProps) {
  const topFoodsByFrequencyData = React.useMemo(() => {
    if (!data?.topFoodsByFrequency) return [];
    // Assuming API already returns top 5 or a reasonable number
    // If not, slice it here: data.topFoodsByFrequency.slice(0, 5)
    return data.topFoodsByFrequency.map((food, index) => ({
      ...food,
      fill: barColorPalette[index % barColorPalette.length],
    }));
  }, [data]);

  const weeklyMacronutrientData = React.useMemo(() => {
    if (!data?.nutrientTotals) return [];
    return [
      { name: 'Protein', value: Math.round(data.nutrientTotals.totalProtein), fill: chartConfig.protein.color },
      { name: 'Carbs', value: Math.round(data.nutrientTotals.totalCarbs), fill: chartConfig.carbs.color },
      { name: 'Fat', value: Math.round(data.nutrientTotals.totalFat), fill: chartConfig.fat.color },
    ].filter(macro => macro.value > 0);
  }, [data]);

  const topFoodsByCaloriesData = React.useMemo(() => {
    if (!data?.topFoodsByCalories) return [];
    // Assuming API already returns top 5 or a reasonable number
    return data.topFoodsByCalories.map((food, index) => ({
      ...food,
      name: food.name,
      value: food.totalCalories,
      fill: barColorPalette[index % barColorPalette.length],
    }));
  }, [data]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(2)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4 mb-1" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[250px] w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error Loading Weekly Data</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  }

  if (!data) {
    return (
      <Alert>
        <AlertTitle>No Weekly Data</AlertTitle>
        <AlertDescription>No weekly nutrition data available for the selected period.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Weekly Summary ({data.weekStartDate} - {data.weekEndDate})</CardTitle>
          <CardDescription>Your key nutritional metrics for the week.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {
              [
                {
                  label: "Avg. Daily Calories",
                  value: `${Math.round(data.averageDailyCalories)} kcal`,
                  icon: <Flame className="h-6 w-6 mb-2" style={{ color: chartConfig.calories.color }} />,
                  bgColor: "bg-orange-50 dark:bg-orange-900/30",
                  borderColor: "border-orange-200 dark:border-orange-800"
                },
                {
                  label: "Total Protein",
                  value: `${Math.round(data.nutrientTotals.totalProtein)}g`,
                  icon: <Beef className="h-6 w-6 mb-2" style={{ color: chartConfig.protein.color }} />,
                  bgColor: "bg-blue-50 dark:bg-blue-900/30",
                  borderColor: "border-blue-200 dark:border-blue-800"
                },
                {
                  label: "Total Carbs",
                  value: `${Math.round(data.nutrientTotals.totalCarbs)}g`,
                  icon: <Wheat className="h-6 w-6 mb-2" style={{ color: chartConfig.carbs.color }} />,
                  bgColor: "bg-green-50 dark:bg-green-900/30",
                  borderColor: "border-green-200 dark:border-green-800"
                },
                {
                  label: "Total Fat",
                  value: `${Math.round(data.nutrientTotals.totalFat)}g`,
                  icon: <Droplets className="h-6 w-6 mb-2" style={{ color: chartConfig.fat.color }} />,
                  bgColor: "bg-purple-50 dark:bg-purple-900/30",
                  borderColor: "border-purple-200 dark:border-purple-800"
                },
              ].map((metric, index) => (
                <div key={index} className={`p-4 rounded-lg flex flex-col items-center justify-center text-center border ${metric.bgColor} ${metric.borderColor}`}>
                  {metric.icon}
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                  <p className="text-xl font-semibold">{metric.value}</p>
                </div>
              ))
            }
          </div>
        </CardContent>
      </Card>

      {/* Weekly Calorie Trend Chart */}
      {data.dailyBreakdown && data.dailyBreakdown.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Weekly Calorie Trend</CardTitle>
            <CardDescription>Daily calorie intake over the week.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.dailyBreakdown} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(dateString) => new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} domain={[0, 'auto']} />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent
                      indicator="dot"
                      labelFormatter={(label) => new Date(label).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
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
      {/* Weekly Macronutrient Totals Chart */}
      {weeklyMacronutrientData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Weekly Macronutrient Totals</CardTitle>
            <CardDescription>Total protein, carbs, and fat for the week.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyMacronutrientData} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                  <XAxis type="number" dataKey="value" tickFormatter={(value) => `${value}g`} />
                  <YAxis type="category" dataKey="name" width={60} tickLine={false} axisLine={false} />
                  <ChartTooltip 
                    cursor={false} 
                    content={<ChartTooltipContent hideLabel indicator="dot" formatter={(value) => `${value}g`} />}
                  />
                  <Bar dataKey="value" radius={5}>
                    {weeklyMacronutrientData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      )}
      {/* Top Foods by Frequency Chart */}
      {topFoodsByFrequencyData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top Foods by Frequency</CardTitle>
            <CardDescription>Most frequently consumed foods this week.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topFoodsByFrequencyData} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                  <XAxis type="number" dataKey="count" />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    width={80} 
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(value) => value.length > 10 ? `${value.substring(0,10)}...` : value} // Truncate long names
                  />
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
      {/* Top Foods by Calories Chart */}
      {topFoodsByCaloriesData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top Foods by Calories</CardTitle>
            <CardDescription>Foods contributing the most calories this week.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topFoodsByCaloriesData} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                  <XAxis type="number" dataKey="value" tickFormatter={(value) => `${value} kcal`} />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    width={80} 
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(value) => value.length > 10 ? `${value.substring(0,10)}...` : value} // Truncate long names
                  />
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
