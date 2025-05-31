export interface Food {
  id: string;
  daily_nutrition_id: string;
  food_name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  image_url: string;
  consumed_at: string; // ISO string for timestamp
}

export interface DailyNutritionRecord {
  id: string;
  user_id: string;
  date: string; // Format: YYYY-MM-DD
  total_calories: number;
  consumed_foods: Food[];
}

export interface DailyCalorieSummary {
  date: string; // Format: YYYY-MM-DD, or a format suitable for chart display
  calories: number;
}

// Helper types for aggregated summaries
export interface AggregatedNutrientSummary {
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

export interface FoodFrequencySummary {
  name: string;
  count: number;
}

export interface FoodCalorieSummary {
  name: string;
  totalCalories: number;
}

// Weekly Summary Type
export interface WeeklyNutritionSummary {
  weekStartDate: string; // YYYY-MM-DD
  weekEndDate: string; // YYYY-MM-DD
  averageDailyCalories: number;
  nutrientTotals: AggregatedNutrientSummary;
  topFoodsByFrequency: FoodFrequencySummary[]; // e.g., top 5
  topFoodsByCalories: FoodCalorieSummary[]; // e.g., top 5
  dailyBreakdown: DailyCalorieSummary[]; // 7 days of calorie summaries for a weekly trend chart
}

// For monthly trend, average calories per week
export interface WeeklyAverageCalorieSummary {
  weekNumber: number; // 1-5, representing the week within the month
  weekStartDate: string; // YYYY-MM-DD
  weekEndDate: string; // YYYY-MM-DD
  averageCalories: number;
}

// Monthly Summary Type
export interface MonthlyNutritionSummary {
  month: number; // 1-12
  year: number;
  averageDailyCalories: number;
  nutrientTotals: AggregatedNutrientSummary;
  topFoodsByFrequency: FoodFrequencySummary[];
  topFoodsByCalories: FoodCalorieSummary[];
  // Option 1: Breakdown by week
  weeklyAverageBreakdown?: WeeklyAverageCalorieSummary[]; 
  // Option 2: Or full daily breakdown for the month if preferred for detailed charts
  dailyBreakdown?: DailyCalorieSummary[]; 
}