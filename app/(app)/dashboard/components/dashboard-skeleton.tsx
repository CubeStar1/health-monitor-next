import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function DashboardSkeleton() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between space-y-2">
        <Skeleton className="h-8 w-[150px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-7 w-[60px] mb-1" />
              <Skeleton className="h-4 w-[120px]" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts and Recent Items */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Charts */}
        <Card className="col-span-4">
          <CardHeader>
            <Skeleton className="h-5 w-[100px]" />
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <Skeleton className="h-full w-full" />
            </div>
          </CardContent>
        </Card>

        {/* Recent Items */}
        <div className="col-span-3 space-y-4">
          {/* Recent Records */}
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-[120px] mb-2" />
              <Skeleton className="h-4 w-[180px]" />
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center">
                    <div className="flex items-center space-x-4">
                      <Skeleton className="h-4 w-4" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[200px]" />
                        <Skeleton className="h-3 w-[120px]" />
                      </div>
                    </div>
                    <Skeleton className="h-4 w-[60px] ml-auto" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-[120px] mb-2" />
              <Skeleton className="h-4 w-[180px]" />
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[180px]" />
                      <Skeleton className="h-3 w-[100px]" />
                    </div>
                    <Skeleton className="h-4 w-[60px] ml-auto" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Links */}
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-[100px] mb-2" />
          <Skeleton className="h-4 w-[250px]" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-[100px] w-full rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 