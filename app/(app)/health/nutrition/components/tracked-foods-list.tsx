import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Info, Trash2, ListX, AppleIcon, Clock, CircleUserRound } from "lucide-react"
import { NutrientBadge } from "./nutrient-badge"
import { Food } from "../types"
import Image from "next/image"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface TrackedFoodsListProps {
  foods: Food[]
  onDeleteFood: (foodId: string) => void
  isLoading: boolean
}

import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function TrackedFoodsList({ foods, onDeleteFood, isLoading }: TrackedFoodsListProps) {
  // if (isLoading) {
  //   return (
  //     <motion.div 
  //       className="space-y-3"
  //       initial={{ opacity: 0.6 }}
  //       animate={{ opacity: 1 }}
  //       transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
  //     >
  //       {[...Array(3)].map((_, i) => (
  //         <Card key={i} className="p-4 border border-muted/60 overflow-hidden">
  //           <div className="flex items-center space-x-4">
  //             <Skeleton className="h-14 w-14 rounded-full" />
  //             <div className="space-y-2 flex-grow">
  //               <Skeleton className="h-5 w-3/4" />
  //               <div className="flex space-x-2">
  //                 <Skeleton className="h-4 w-16" />
  //                 <Skeleton className="h-4 w-20" />
  //               </div>
  //             </div>
  //             <div className="flex space-x-2">
  //               <Skeleton className="h-9 w-9 rounded-full" />
  //               <Skeleton className="h-9 w-9 rounded-full" />
  //             </div>
  //           </div>
  //         </Card>
  //       ))}
  //     </motion.div>
  //   );
  // }

  if (foods.length === 0) {
    return (
      <motion.div 
        className="mt-6 text-center py-10 px-4 border border-dashed rounded-xl bg-muted/5"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative mx-auto w-24 h-24 mb-5">
          <motion.div 
            className="absolute inset-0 rounded-full bg-muted/20 flex items-center justify-center"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
          >
            <AppleIcon className="h-10 w-10 text-muted-foreground/70" />
          </motion.div>
        </div>
        <h3 className="text-xl font-semibold mb-2">No Foods Tracked Yet</h3>
        <p className="text-sm text-muted-foreground max-w-xs mx-auto mb-4">
          Start logging your meals by searching for foods in the search box above.
        </p>
        <Badge variant="outline" className="mx-auto bg-primary/5 text-primary hover:bg-primary/10 transition-colors">
          <CircleUserRound className="mr-1 h-3 w-3" /> Track your first meal
        </Badge>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="space-y-4 mt-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-tight flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          Today&apos;s Consumed Foods
        </h2>
        <Badge variant="outline" className="bg-muted/50">
          {foods.length} {foods.length === 1 ? 'item' : 'items'}
        </Badge>
      </div>

      {foods.map((food, index) => (
        <motion.div
          key={food.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: index * 0.05 }}
        >
          <Card className={cn(
            "overflow-hidden border-l-4 group hover:bg-accent/5 transition-all duration-200",
            index % 3 === 0 ? "border-l-blue-500/70" : 
            index % 3 === 1 ? "border-l-green-500/70" : "border-l-amber-500/70"
          )}>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-14 w-14 border shadow-sm group-hover:shadow transition-shadow duration-200">
                  <AvatarImage src={food.image_url} alt={food.food_name} className="object-cover" />
                  <AvatarFallback className="bg-muted">{food.food_name ? food.food_name.substring(0, 2).toUpperCase() : 'FD'}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-base leading-tight group-hover:text-primary transition-colors">{food.food_name}</p>
                  <div className="flex items-center mt-1 space-x-2">
                    <Badge variant="secondary" className="text-xs font-normal px-2 py-0">
                      {food.calories} kcal
                    </Badge>
                    <p className="text-xs text-muted-foreground">{food.protein}g protein</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Dialog>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="icon" className="h-9 w-9 rounded-full hover:bg-primary/10 hover:text-primary transition-colors">
                            <Info className="h-4 w-4" />
                            <span className="sr-only">View details for {food.food_name}</span>
                          </Button>
                        </DialogTrigger>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>View details</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <DialogContent className="max-w-md p-0 overflow-hidden">
                  <div className="relative h-48 w-full bg-gradient-to-b from-primary/50 to-background/80">
                    <Image 
                      src={food.image_url} 
                      alt={food.food_name} 
                      className="w-full h-full object-cover opacity-90 mix-blend-overlay" 
                      width={500} 
                      height={300} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent">
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-16 w-16 border-2 border-white/30 shadow-lg">
                            <AvatarImage src={food.image_url} alt={food.food_name} className="object-cover" />
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {food.food_name ? food.food_name.substring(0,2).toUpperCase() : 'FD'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <DialogTitle className="text-2xl font-bold leading-tight">{food.food_name}</DialogTitle>
                            <CardDescription className="flex items-center gap-1">
                              <Clock className="h-3 w-3" /> Added today
                            </CardDescription>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Nutritional Information</h3>
                      <Badge className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                        {food.calories} kcal
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                        <NutrientBadge 
                          label="Calories" 
                          value={food.calories} 
                          unit="kcal" 
                          color="bg-amber-500/10 text-amber-600 border-amber-200/50" 
                        />
                      </motion.div>
                      <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <NutrientBadge 
                          label="Protein" 
                          value={food.protein} 
                          unit="g" 
                          color="bg-blue-500/10 text-blue-600 border-blue-200/50" 
                        />
                      </motion.div>
                      <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                        <NutrientBadge 
                          label="Carbs" 
                          value={food.carbs} 
                          unit="g" 
                          color="bg-green-500/10 text-green-600 border-green-200/50" 
                        />
                      </motion.div>
                      <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                        <NutrientBadge 
                          label="Fat" 
                          value={food.fat} 
                          unit="g" 
                          color="bg-red-500/10 text-red-600 border-red-200/50" 
                        />
                      </motion.div>
                    </div>
                  </div>
                </DialogContent>
                </Dialog>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => onDeleteFood(food.id)} 
                        className="h-9 w-9 rounded-full hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete {food.food_name}</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Remove from log</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  )
}