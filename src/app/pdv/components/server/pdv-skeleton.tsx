import { Card, CardContent, CardHeader } from "@/components/ui/card";

/**
 * Loading skeleton for PDV page
 * Server Component - no interactivity needed
 */
export function PDVSkeleton() {
  return (
    <div className="flex min-h-screen overflow-x-hidden bg-neutral-100 dark:bg-neutral-900">
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header skeleton */}
        <div className="h-16 w-full animate-pulse bg-neutral-200 dark:bg-neutral-800" />

        <main className="min-w-0 flex-1 overflow-x-hidden p-4 lg:p-6">
          <div className="grid max-w-full grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
            {/* Left column skeleton */}
            <div className="flex min-w-0 flex-col gap-4 lg:col-span-2 lg:gap-6">
              <Card>
                <CardHeader>
                  <div className="h-6 w-32 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="h-20 w-full animate-pulse rounded bg-neutral-200 dark:bg-neutral-700" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="h-6 w-24 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="h-24 w-full animate-pulse rounded bg-neutral-200 dark:bg-neutral-700" />
                    <div className="h-24 w-full animate-pulse rounded bg-neutral-200 dark:bg-neutral-700" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right column skeleton */}
            <div className="flex min-w-0 flex-col gap-4 lg:col-span-1 lg:gap-6">
              <Card>
                <CardHeader>
                  <div className="h-6 w-20 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="h-10 w-full animate-pulse rounded bg-neutral-200 dark:bg-neutral-700" />
                    <div className="h-10 w-full animate-pulse rounded bg-neutral-200 dark:bg-neutral-700" />
                    <div className="h-10 w-full animate-pulse rounded bg-neutral-200 dark:bg-neutral-700" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="h-6 w-32 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700" />
                </CardHeader>
                <CardContent>
                  <div className="h-24 w-full animate-pulse rounded bg-neutral-200 dark:bg-neutral-700" />
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
