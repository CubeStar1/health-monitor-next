import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardHeader, CardContent } from "@/components/ui/card"

interface CalorieProgressProps {
  currentCalories: number
  goalCalories: number
  isLoading: boolean
}

export function CalorieProgress({ currentCalories, goalCalories, isLoading }: CalorieProgressProps) {
  if (isLoading) {
    return (
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <Skeleton className="h-6 w-1/2 mb-1" />
          <Skeleton className="h-4 w-1/3" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-8 w-full" />
        </CardContent>
      </Card>
    )
  }

  const progress = goalCalories > 0 ? (currentCalories / goalCalories) * 100 : 0

  return (
    <div className="mt-6">
      <p className="font-medium mb-2">Total Calories: {currentCalories} / {goalCalories}</p>
      <Progress value={progress} className="w-full" />
    </div>
  )
}