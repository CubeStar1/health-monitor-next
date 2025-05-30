"use client"

import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function HealthProfileTab() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-lg font-medium">Complete your health profile to get valuable insights into your health.</h2>
        <Progress value={7} className="h-2 w-full" />
        <p className="text-sm text-muted-foreground">7% completed</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>General Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input id="age" placeholder="Enter your age" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Height</Label>
              <Input id="height" placeholder="Enter your height" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Weight</Label>
              <Input id="weight" placeholder="Enter your weight" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ethnicity">Ethnicity</Label>
              <Select>
                <SelectTrigger id="ethnicity">
                  <SelectValue placeholder="Select ethnicity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asian">Asian</SelectItem>
                  <SelectItem value="black">Black</SelectItem>
                  <SelectItem value="hispanic">Hispanic</SelectItem>
                  <SelectItem value="white">White</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Main Health Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Add main health information form fields */}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lab Test Interpretation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Add lab test interpretation form fields */}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 