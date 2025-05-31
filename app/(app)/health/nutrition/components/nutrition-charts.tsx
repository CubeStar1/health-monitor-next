"use client"

import React, { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { Food, DailyCalorieSummary } from "../types"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface NutritionChartsProps {
  dailyCalorieData: DailyCalorieSummary[];
  consumedFoodsToday: Food[];
  isLoading: boolean;
  error: Error | null;
}

export function NutritionCharts({ dailyCalorieData, consumedFoodsToday, isLoading, error }: NutritionChartsProps) {
  const formatDailyXAxis = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; // Fallback for invalid dates
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatTooltipDateLabel = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

    // dailyCalories is now directly from dailyCalorieData, which is already in the correct format {date, calories}
  // The dailyCalorieData prop should be used directly for the AreaChart for daily calorie intake.
  // No complex useMemo needed here for dailyCalories, but ensure dailyCalorieData is used in the AreaChart's data prop.

  const macronutrients = useMemo(() => {
    const totalProtein = consumedFoodsToday.reduce((sum: number, food: Food) => sum + (food.protein || 0), 0);
    const totalCarbs = consumedFoodsToday.reduce((sum: number, food: Food) => sum + (food.carbs || 0), 0);
    const totalFat = consumedFoodsToday.reduce((sum: number, food: Food) => sum + (food.fat || 0), 0);
    return [
      { name: 'Protein', value: Math.round(totalProtein) }, // Round values for display
      { name: 'Carbs', value: Math.round(totalCarbs) },
      { name: 'Fat', value: Math.round(totalFat) },
    ].filter(macro => macro.value > 0); // Only include macros with values > 0
  }, [consumedFoodsToday])

  const foodFrequency = useMemo(() => {
    const frequency: { [key: string]: number } = {}
    consumedFoodsToday.forEach(food => {
      frequency[food.food_name] = (frequency[food.food_name] || 0) + 1
    })
    return Object.entries(frequency)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5) // Top 5 most frequent
  }, [consumedFoodsToday])

  const topCalorieFoods = useMemo(() => {
    const calorieMap: { [key: string]: number } = {};
    consumedFoodsToday.forEach(food => {
      calorieMap[food.food_name] = (calorieMap[food.food_name] || 0) + food.calories;
    });
    return Object.entries(calorieMap)
      .map(([name, calories]) => ({ name, calories: Math.round(calories) }))
      .sort((a, b) => b.calories - a.calories)
      .slice(0, 5); // Top 5 calorie sources
  }, [consumedFoodsToday]);
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Skeleton for Daily Calorie Intake Chart */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-3/4 mb-1" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>

        {/* Skeleton for Macronutrient Breakdown Chart */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-3/4 mb-1" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[350px] w-full" />
          </CardContent>
        </Card>

        {/* Skeleton for Most Frequently Consumed Foods Chart */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-3/4 mb-1" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>

        {/* Skeleton for Top Calorie Sources Today Chart */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-3/4 mb-1" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }



  const chartConfig: ChartConfig = {
    calories: { label: "Calories", color: "hsl(var(--chart-1))" }, // Existing color for calorie chart
    protein: { label: "Protein", color: "hsl(210 90% 50%)" }, // Blue
    carbs: { label: "Carbs", color: "hsl(145 65% 45%)" },   // Green
    fat: { label: "Fat", color: "hsl(35 95% 55%)" },       // Orange/Amber
    food: { label: "Count", color: "hsl(var(--chart-2))" }, // A default color for frequency bars
    topFoodCalories: { label: "Calories", color: "hsl(var(--chart-3))" } // Color for top calorie foods chart
  } satisfies ChartConfig;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Daily Calorie Intake</CardTitle>
          <CardDescription>Calories consumed per day</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyCalorieData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDailyXAxis}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  domain={[0, 'auto']}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent
                    indicator="dot"
                    labelFormatter={formatTooltipDateLabel}
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
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {macronutrients.length > 0 ? (
        <Card className="col-span-1 lg:col-span-1">
          <CardHeader>
            <CardTitle>Macronutrient Breakdown</CardTitle>
            <CardDescription>Grams of Protein, Carbs, and Fat for today.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={macronutrients} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                  <XAxis type="number" dataKey="value" tickFormatter={(value) => `${value}g`} />
                  <YAxis type="category" dataKey="name" width={60} tickLine={false} axisLine={false} />
                  <ChartTooltip 
                    cursor={false} 
                    content={<ChartTooltipContent hideLabel indicator="dot" formatter={(value, name) => `${value}g`} />}
                  />
                  <Bar dataKey="value" radius={5}>
                    {macronutrients.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={chartConfig[entry.name.toLowerCase() as keyof typeof chartConfig]?.color || "hsl(var(--chart-1))"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      ) : (
        <Card className="col-span-1 lg:col-span-1 h-[350px]">
          <CardHeader>
            <CardTitle>Macronutrient Breakdown</CardTitle>
            <CardDescription>No macronutrient data for today.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Log foods to see breakdown.</p>
          </CardContent>
        </Card>
      )}

      {/* Most Frequently Consumed Foods Chart */}
      {foodFrequency.length > 0 ? (
        <Card className="col-span-1 lg:col-span-1">
          <CardHeader>
            <CardTitle>Most Frequently Consumed Foods</CardTitle>
            <CardDescription>Top 5 foods by frequency for today.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={foodFrequency} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    type="category"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    angle={-30}
                    textAnchor="end"
                    height={50} // Adjust height to accommodate rotated labels
                    interval={0} // Show all labels
                  />
                  <YAxis
                    type="number"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    allowDecimals={false}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent
                      indicator="line"
                      formatter={(value, name, props) => [value, props.payload?.name]}
                    />}
                  />
                  <Bar dataKey="count" radius={5}>
                    {foodFrequency.map((entry, index) => (
                      <Cell key={`cell-freq-${index}`} fill={`hsl(var(--chart-${(index % 5) + 1}))`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      ) : (
        <Card className="col-span-1 lg:col-span-1">
          <CardHeader>
            <CardTitle>Most Frequently Consumed Foods</CardTitle>
            <CardDescription>No food frequency data for today.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-[300px]">
            <p className="text-muted-foreground">Log foods to see frequency.</p>
          </CardContent>
        </Card>
      )}

      {/* Top Calorie Sources Today Chart */}
      {topCalorieFoods.length > 0 ? (
        <Card className="col-span-1 lg:col-span-1">
          <CardHeader>
            <CardTitle>Top Calorie Sources Today</CardTitle>
            <CardDescription>Top 5 foods by calorie contribution.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topCalorieFoods} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                  <XAxis type="number" dataKey="calories" tickFormatter={(value) => `${value}kcal`} />
                  <YAxis type="category" dataKey="name" width={80} tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                  <ChartTooltip 
                    cursor={false} 
                    content={<ChartTooltipContent hideLabel indicator="dot" formatter={(value) => `${value} kcal`} />}
                  />
                  <Bar dataKey="calories" radius={5}>
                    {topCalorieFoods.map((entry, index) => (
                      <Cell key={`cell-top-cal-${index}`} fill={`hsl(var(--chart-${(index % 5) + 1}))`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      ) : (
        <Card className="col-span-1 lg:col-span-1">
          <CardHeader>
            <CardTitle>Top Calorie Sources Today</CardTitle>
            <CardDescription>No calorie source data for today.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-[350px]">
            <p className="text-muted-foreground">Log foods to see top calorie sources.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}