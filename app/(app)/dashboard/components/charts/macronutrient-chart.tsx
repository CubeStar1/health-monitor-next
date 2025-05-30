import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"
import { RadialBarChart, RadialBar, Tooltip } from "recharts"
import { TrendingUp } from "lucide-react"

interface MacronutrientChartProps {
  data: Array<{ name: string; value: number; fill: string; percent: number }>
  config: ChartConfig
}

const MacroTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          <span className="font-medium">{data.name}</span>
          <span className="font-medium">{data.value}g</span>
          <span className="text-muted-foreground">Percentage</span>
          <span className="text-muted-foreground">{data.percent}%</span>
        </div>
      </div>
    );
  }
  return null;
};

export function MacronutrientChart({ data, config }: MacronutrientChartProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-sm font-medium">Macronutrient Distribution</CardTitle>
        <CardDescription>Protein, Carbs, and Fat breakdown</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={config}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart 
            data={data} 
            innerRadius={30} 
            outerRadius={110}
            startAngle={90}
            endAngle={-270}
          >
            <Tooltip content={<MacroTooltip />} />
            <RadialBar 
              dataKey="value" 
              background
              label={{ 
                position: 'insideStart', 
                fill: '#fff',
                formatter: (value: number) => `${value}g`
              }}
            />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          <TrendingUp className="h-4 w-4" />
          {Math.round(data.reduce((sum, macro) => sum + macro.value, 0))}g total
        </div>
        <div className="leading-none text-muted-foreground">
          Based on your nutrition logs
        </div>
      </CardFooter>
    </Card>
  )
} 