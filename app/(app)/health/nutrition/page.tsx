"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { FoodSearch } from "./components/FoodSearch"
import { TrackedFoodsList } from "./components/TrackedFoodsList"
import { CalorieProgress } from "./components/CalorieProgress"
import { Food } from "./types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronRight, ChevronLeft } from 'lucide-react'
import { ScrollArea } from "@/components/ui/scroll-area"
import useUser from "@/hooks/use-user"
import { NutritionCharts } from "./components/NutritionCharts"

export default function NutritionTracker() {
  const [trackedFoods, setTrackedFoods] = useState<Food[]>([])
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const { toast } = useToast()
  const {data:user, error} = useUser()

  useEffect(() => {
    if (user) {
      loadTrackedFoods();
    }
  }, [user]);

  const loadTrackedFoods = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const userId = user?.id;
      if (!userId) {
        throw new Error("User not authenticated");
      }

      const response = await fetch(`/api/nutrition/daily?user_id=${userId}&date=${today}`);
      if (response.ok) {
        const data = await response.json();
        if (data && data.consumed_foods) {
          setTrackedFoods(data.consumed_foods);
        }
      } else if (response.status !== 404) {
        throw new Error("Failed to load tracked foods");
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load tracked foods. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const addFood = async (foodName: string) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const userId = user?.id;
      if (!userId) {
        throw new Error("User not authenticated");
      }

      const dailyResponse = await fetch(`/api/nutrition/daily?user_id=${userId}&date=${today}`);
      let dailyData;

      if (dailyResponse.status === 404 || !dailyResponse.ok) {
        const createResponse = await fetch('/api/nutrition/daily', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: userId, date: today, total_calories: 0 }),
        });
        if (!createResponse.ok) {
          const errorData = await createResponse.json();
          throw new Error(`Failed to create daily nutrition: ${errorData.error}`);
        }
        dailyData = await createResponse.json();
      } else {
        dailyData = await dailyResponse.json();
      }


      const response = await fetch('/api/nutrition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: foodName, type: 'nutrients' }),
      });
      const data = await response.json();
      if (data.foods && data.foods.length > 0) {
        const food = data.foods[0];
        const newFood: Food = {
          id: '', 
          daily_nutrition_id: dailyData.id,
          food_name: food.food_name,
          calories: Math.round(food.nf_calories),
          protein: food.nf_protein,
          carbs: food.nf_total_carbohydrate,
          fat: food.nf_total_fat,
          image_url: food.photo.highres,
          consumed_at: new Date().toISOString(),
        };
        const consumedResponse = await fetch('/api/nutrition/consumed', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newFood),
        });
        const consumedData: Food[] = await consumedResponse.json();
        setTrackedFoods(prevFoods => [...prevFoods, consumedData[0]]); 
        toast({
          title: 'Food Added',
          description: `${food.food_name} has been added to your tracked foods.`,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred while adding the food.',
        variant: 'destructive',
      });
    }
  }

  const deleteFood = async (foodId: string) => {
    try {
      const response = await fetch(`/api/nutrition/consumed/${foodId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to delete food: ${errorData.error}`);
      }

      setTrackedFoods(prevFoods => prevFoods.filter(food => food.id !== foodId));
      toast({
        title: 'Food Deleted',
        description: 'The food has been removed from your tracked foods.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete food. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const totalCalories = trackedFoods.reduce((sum, food) => sum + food.calories, 0)
  const calorieGoal = 2000 

  return (
    <div className="flex h-[calc(100vh-120px)] overflow-hidden gap-4">
      <div className={`${isSidebarOpen ? 'w-96' : 'w-0'} transition-all duration-300 overflow-hidden`}>
        <Card className="h-full flex flex-col">
          <CardHeader>
            <CardTitle>Nutrition Tracker</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow overflow-hidden flex flex-col">
            <div className="mb-4">
              <FoodSearch onAddFood={addFood} />
            </div>
            <ScrollArea className="flex-grow">
              <TrackedFoodsList foods={trackedFoods} onDeleteFood={deleteFood} />
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <div className="flex-grow overflow-hidden">
        <Card className="h-full flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Nutrition Analytics</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              {isSidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          </CardHeader>
          <ScrollArea className="flex-grow">
          <CardContent className="">
            <div className="mb-6">
              <CalorieProgress totalCalories={totalCalories} calorieGoal={calorieGoal} />
            </div>
            <NutritionCharts foods={trackedFoods} />
          </CardContent>
          </ScrollArea>
        </Card>
      </div>
    </div>
  )
}