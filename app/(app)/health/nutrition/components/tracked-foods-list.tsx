import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Info, Trash2, ListX } from "lucide-react"
import { NutrientBadge } from "./nutrient-badge"
import { Food } from "../types"
import Image from "next/image"

interface TrackedFoodsListProps {
  foods: Food[]
  onDeleteFood: (foodId: string) => void
  isLoading: boolean
}

import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

export function TrackedFoodsList({ foods, onDeleteFood, isLoading }: TrackedFoodsListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-3">
            <div className="flex items-center space-x-3">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-1 flex-grow">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
              <Skeleton className="h-8 w-8" /> 
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (foods.length === 0) {
    return (
      <div className="mt-6 text-center text-muted-foreground py-8 px-4 border border-dashed rounded-lg">
        <ListX className="mx-auto h-12 w-12 text-gray-400 mb-3" />
        <h3 className="text-lg font-semibold">No Foods Tracked Yet</h3>
        <p className="text-sm">Search above to add foods to your daily log.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 mt-4">
      <h2 className="text-lg font-semibold tracking-tight">Today&apos;s Consumed Foods</h2>
      {foods.map((food) => (
        <Card key={food.id} className="overflow-hidden hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10 border">
                <AvatarImage src={food.image_url} alt={food.food_name} />
                <AvatarFallback>{food.food_name ? food.food_name.substring(0, 2).toUpperCase() : 'FD'}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-sm leading-tight">{food.food_name}</p>
                <p className="text-xs text-muted-foreground">{food.calories} kcal</p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent">
                    <Info className="h-4 w-4 text-muted-foreground" />
                    <span className="sr-only">View details for {food.food_name}</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md p-6">
                  <DialogHeader className="mb-4">
                    <div className="flex items-center space-x-3 mb-3">
                        <Avatar className="h-16 w-16 border">
                            <AvatarImage src={food.image_url} alt={food.food_name} />
                            <AvatarFallback>{food.food_name ? food.food_name.substring(0,2).toUpperCase() : 'FD'}</AvatarFallback>
                        </Avatar>
                        <div>
                            <DialogTitle className="text-2xl font-bold leading-tight">{food.food_name}</DialogTitle>
                            <CardDescription>{food.calories} kcal</CardDescription>
                        </div>
                    </div>
                    <Image src={food.image_url} alt={food.food_name} className="w-full h-48 object-cover rounded-md mt-2 mb-4" width={300} height={192} /> 
                  </DialogHeader>
                  <h3 className="text-lg font-semibold mb-3">Nutritional Information</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <NutrientBadge label="Calories" value={food.calories} unit="kcal" />
                    <NutrientBadge label="Protein" value={food.protein} unit="g" />
                    <NutrientBadge label="Carbs" value={food.carbs} unit="g" />
                    <NutrientBadge label="Fat" value={food.fat} unit="g" />
                  </div>
                </DialogContent>
              </Dialog>
              <Button variant="ghost" size="icon" onClick={() => onDeleteFood(food.id)} className="h-8 w-8 hover:bg-destructive/10">
                <Trash2 className="h-4 w-4 text-destructive" />
                <span className="sr-only">Delete {food.food_name}</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}