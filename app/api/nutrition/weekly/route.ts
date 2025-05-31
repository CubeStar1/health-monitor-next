import { NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import {
  DailyNutritionRecord,
  WeeklyNutritionSummary,
  AggregatedNutrientSummary,
  FoodFrequencySummary,
  FoodCalorieSummary,
  DailyCalorieSummary,
  Food
} from '@/app/(app)/health/nutrition/types';

export async function GET(request: Request) {
  const supabase = await createSupabaseServer();
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('user_id');
  const endDateString = searchParams.get('endDate') || new Date().toISOString().split('T')[0];

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const endDate = new Date(endDateString);
    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - 6); // 7 days including endDate
    const startDateString = startDate.toISOString().split('T')[0];

    // Fetch daily records for the week
    const { data: dailyRecords, error: dailyError } = await supabase
      .from('daily_nutrition')
      .select('*, consumed_foods(*)')
      .eq('user_id', userId)
      .gte('date', startDateString)
      .lte('date', endDateString)
      .order('date', { ascending: true });

    if (dailyError) {
      console.error('Error fetching weekly nutrition data:', dailyError);
      throw dailyError;
    }

    // Initialize dailyBreakdown for all 7 days of the period
    const dailyBreakdown: DailyCalorieSummary[] = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date(startDate);
        d.setDate(startDate.getDate() + i);
        dailyBreakdown.push({ date: d.toISOString().split('T')[0], calories: 0 });
    }

    if (!dailyRecords || dailyRecords.length === 0) {
      return NextResponse.json({ 
        weekStartDate: startDateString,
        weekEndDate: endDateString,
        averageDailyCalories: 0,
        nutrientTotals: { totalProtein: 0, totalCarbs: 0, totalFat: 0 },
        topFoodsByFrequency: [],
        topFoodsByCalories: [],
        dailyBreakdown: dailyBreakdown // Use pre-initialized breakdown
      } as WeeklyNutritionSummary, { status: 200 });
    }

    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    let totalCaloriesSum = 0;
    const allFoods: Food[] = [];
    
    // Create a map for quick lookup of records by date
    const recordsMap = new Map<string, DailyNutritionRecord>();
    dailyRecords.forEach((r: any) => recordsMap.set(r.date, r as DailyNutritionRecord));

    // Populate dailyBreakdown with actual data and sum nutrients
    dailyBreakdown.forEach(daySummary => {
        const record = recordsMap.get(daySummary.date);
        if (record) {
            let dayCalories = 0;
            record.consumed_foods.forEach(food => {
                totalProtein += food.protein || 0;
                totalCarbs += food.carbs || 0;
                totalFat += food.fat || 0;
                dayCalories += food.calories || 0;
                allFoods.push(food);
            });
            daySummary.calories = dayCalories; // Update calories for the day
            totalCaloriesSum += dayCalories;
        }
    });

    const nutrientTotals: AggregatedNutrientSummary = {
      totalProtein: Math.round(totalProtein),
      totalCarbs: Math.round(totalCarbs),
      totalFat: Math.round(totalFat),
    };

    const foodFrequency: { [key: string]: number } = {};
    allFoods.forEach(food => {
      foodFrequency[food.food_name] = (foodFrequency[food.food_name] || 0) + 1;
    });
    const topFoodsByFrequency: FoodFrequencySummary[] = Object.entries(foodFrequency)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const foodCalories: { [key: string]: number } = {};
    allFoods.forEach(food => {
      foodCalories[food.food_name] = (foodCalories[food.food_name] || 0) + food.calories;
    });
    const topFoodsByCalories: FoodCalorieSummary[] = Object.entries(foodCalories)
      .map(([name, tc]) => ({ name, totalCalories: Math.round(tc) }))
      .sort((a, b) => b.totalCalories - a.totalCalories)
      .slice(0, 5);
      
    // Calculate average over the 7-day period, even if some days have no records
    const averageDailyCalories = Math.round(totalCaloriesSum / 7);

    const weeklySummary: WeeklyNutritionSummary = {
      weekStartDate: startDateString,
      weekEndDate: endDateString,
      averageDailyCalories,
      nutrientTotals,
      topFoodsByFrequency,
      topFoodsByCalories,
      dailyBreakdown, // This now correctly has 7 entries
    };

    return NextResponse.json(weeklySummary, { status: 200 });
  } catch (error) {
    console.error('Error in /api/nutrition/weekly:', error);
    return NextResponse.json({ error: 'Failed to fetch weekly nutrition data', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
