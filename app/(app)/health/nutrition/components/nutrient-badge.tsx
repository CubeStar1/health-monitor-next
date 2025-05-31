import { Badge } from "@/components/ui/badge"

interface NutrientBadgeProps {
  label: string
  value: number
  unit: string
  color?: string
}

export function NutrientBadge({ label, value, unit, color }: NutrientBadgeProps) {
  const defaultColorClasses = "bg-muted text-muted-foreground border-border";
  const badgeColor = color || defaultColorClasses;
  return (
    <Badge variant="outline" className={`${badgeColor} p-2 text-sm font-medium flex flex-col items-center justify-center w-full h-auto min-h-[60px]`}>
      <span>{label}</span>
            <span className="font-semibold text-base">{value?.toFixed(1)} {unit}</span>
    </Badge>
  )
}