import React from 'react';
import { CalorieProgress } from './calorie-progress'; // Assuming path
import { NutritionCharts } from './nutrition-charts'; // Assuming path
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Beef, Wheat, Droplets } from 'lucide-react'; // Changed Flame to Droplets // Keep Beef, Wheat, Flame. LucideAlertTriangle is not used if top-level error is removed.
import { Food, DailyCalorieSummary } from '../types'; // Assuming path
// Card components from ui/card are not used for this specific card style, divs are used directly.

interface DailyNutritionViewProps {
  totalCaloriesToday: number;
  calorieGoal: number;
  historicalDailyData: DailyCalorieSummary[];
  trackedFoods: Food[];
  isLoading: boolean;
  error: Error | null;
}

export const DailyNutritionView: React.FC<DailyNutritionViewProps> = ({
  totalCaloriesToday,
  calorieGoal,
  historicalDailyData,
  trackedFoods,
  isLoading, // Keep for passing down
  error,     // Keep for passing down
}) => {
  const dailyTotalProtein = trackedFoods.reduce((sum, food) => sum + (food.protein || 0), 0);
  const dailyTotalCarbs = trackedFoods.reduce((sum, food) => sum + (food.carbs || 0), 0);
  const dailyTotalFat = trackedFoods.reduce((sum, food) => sum + (food.fat || 0), 0);

  const summaryItems = [
    {
      label: 'Total Protein',
      value: `${Math.round(dailyTotalProtein)}g`,
      icon: Beef,
      bgColor: 'bg-blue-50 dark:bg-blue-900/30',
      borderColor: 'border-blue-200 dark:border-blue-800',
      textColor: 'text-blue-600 dark:text-blue-400' // Matching icon color to text for consistency
    },
    {
      label: 'Total Carbs',
      value: `${Math.round(dailyTotalCarbs)}g`,
      icon: Wheat,
      bgColor: 'bg-green-50 dark:bg-green-900/30',
      borderColor: 'border-green-200 dark:border-green-800',
      textColor: 'text-green-600 dark:text-green-400'
    },
    {
      label: 'Total Fat',
      value: `${Math.round(dailyTotalFat)}g`,
      icon: Droplets, // Changed Flame to Droplets for consistency with WeeklyView
      bgColor: 'bg-purple-50 dark:bg-purple-900/30',
      borderColor: 'border-purple-200 dark:border-purple-800',
      textColor: 'text-purple-600 dark:text-purple-400' // This color aligns with chart-4 (purple-ish)
    },
  ];

  return (
    <div className="space-y-6">
      <CalorieProgress 
        currentCalories={totalCaloriesToday} 
        goalCalories={calorieGoal} 
        isLoading={isLoading}
      />
      {/* Daily Summary Cards - Styled like WeeklyNutritionView */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {summaryItems.map((metric, index) => (
          <div key={index} className={`p-4 rounded-lg flex flex-col items-center justify-center text-center border ${metric.bgColor} ${metric.borderColor}`}>
            <metric.icon className={`h-6 w-6 mb-2 `} /> {/* Icon color is set here */}
            <p className="text-sm text-muted-foreground">{metric.label}</p> {/* Label style from WeeklyView */}
            <p className="text-xl font-semibold">{metric.value}</p> {/* Value style from WeeklyView, no specific metric.textColor */}
          </div>
        ))}
      </div>
      <NutritionCharts 
        dailyCalorieData={historicalDailyData} 
        consumedFoodsToday={trackedFoods} 
        isLoading={isLoading}
        error={error}
      />
    </div>
  );

};
