"use client";

import { useState, useEffect } from "react"; // Added useEffect
import { FoodSearch } from "./components/food-search";
import { TrackedFoodsList } from "./components/tracked-foods-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { DailyNutritionView } from './components/daily-nutrition-view';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WeeklyNutritionView } from "./components/weekly-nutrition-view";
import { MonthlyNutritionView } from "./components/monthly-nutrition-view";
import useNutritionData from "./hooks/useNutritionData";

export default function NutritionTrackerPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // State for selected month and year for the monthly view
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1); // 1-12
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  const {
    trackedFoods,
    historicalDailyData,
    weeklyData,
    monthlyData,
    totalCaloriesToday,
    isLoadingDaily,
    isLoadingWeekly,
    isLoadingMonthly,
    isMutatingFoodLog,
    errorDaily,
    errorWeekly,
    errorMonthly,
    addFoodEntry,
    deleteFoodEntry,
    // fetchDailyData, // Potentially use if we want to change date ranges
    // fetchWeeklyData, // Already called by default in useNutritionData
    fetchMonthlyData, // Uncommented
    refreshAllData // Assuming this fetches all data including initial monthly
  } = useNutritionData();

  const calorieGoal = 2000;

  // Effect to fetch initial monthly data or when month/year changes via other means (if any)
  // The primary trigger for re-fetch will be handleMonthChange
  useEffect(() => {
    if (fetchMonthlyData) {
      fetchMonthlyData(selectedMonth, selectedYear);
    }
  }, [fetchMonthlyData, selectedMonth, selectedYear]); // Dependencies

  // Handler for when month/year changes in MonthlyNutritionView
  const handleMonthChange = (month: number, year: number) => {
    setSelectedMonth(month);
    setSelectedYear(year);
    // fetchMonthlyData is already called by the useEffect above when selectedMonth/Year changes
    // Or, if you prefer explicit call:
    // if (fetchMonthlyData) {
    //   fetchMonthlyData(month, year);
    // }
  };

  return (
    <div className="flex h-[calc(100vh-120px)] overflow-hidden gap-4 p-1">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-96 min-w-[24rem]' : 'w-0 min-w-0'} transition-all duration-300 overflow-hidden`}>
        <Card className="h-full flex flex-col">
          <CardHeader>
            <CardTitle>Track Food</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow overflow-hidden flex flex-col pt-0">
            <div className="mb-4">
              <FoodSearch onAddFood={addFoodEntry} />
            </div>
            <Separator className="my-2" />
            <p className="text-sm font-medium mb-2 text-muted-foreground px-1">Today&apos;s Log</p>
            <ScrollArea className="flex-grow pr-3">
              <TrackedFoodsList foods={trackedFoods} onDeleteFood={deleteFoodEntry} isLoading={isMutatingFoodLog} />
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Card className="h-full flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="mr-2">
                {isSidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                <span className="sr-only">Toggle Sidebar</span>
              </Button>
              <CardTitle className="text-2xl font-semibold">Nutrition Analytics</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-4 flex flex-col overflow-hidden">
            <Tabs defaultValue="daily" className="h-full flex flex-col">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="daily">Daily</TabsTrigger>
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
              </TabsList>
              <TabsContent value="daily" className="flex-1 mt-2 overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="pr-3">
                    <DailyNutritionView 
                      totalCaloriesToday={totalCaloriesToday}
                      calorieGoal={calorieGoal}
                      historicalDailyData={historicalDailyData}
                      trackedFoods={trackedFoods}
                      isLoading={isLoadingDaily} // Pass only initial load state
                      // isMutating={isMutatingFoodLog} // We'll pass this if a sub-component needs it directly
                      error={errorDaily}
                    />
                  </div>
                </ScrollArea>
              </TabsContent>
              <TabsContent value="weekly" className="flex-1 mt-2 overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="pr-3">
                  <WeeklyNutritionView data={weeklyData} isLoading={isLoadingWeekly} error={errorWeekly} />
                  </div>
                </ScrollArea>
              </TabsContent>
              <TabsContent value="monthly" className="flex-1 mt-2 overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="pr-3">
                  <MonthlyNutritionView 
                    data={monthlyData} 
                    isLoading={isLoadingMonthly} 
                    error={errorMonthly}
                    onMonthChange={handleMonthChange}
                    currentMonth={selectedMonth}
                    currentYear={selectedYear}
                  />
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}