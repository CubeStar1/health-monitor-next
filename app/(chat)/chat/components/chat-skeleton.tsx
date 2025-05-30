import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ChatSkeleton() {
  return (
    <>
      <div className="w-80 border-r p-4">
        <Card className="h-full">
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
      <main className="flex-1 p-6 flex flex-col">
        <div className="flex-1 space-y-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className={`flex ${index % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
              <Card className={`w-2/3 ${index % 2 === 0 ? 'bg-blue-100' : 'bg-gray-100'}`}>
                <CardContent className="p-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4 mt-2" />
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <Skeleton className="h-12 w-full" />
        </div>
      </main>
    </>
  );
}