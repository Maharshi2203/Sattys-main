import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            {/* Header Placeholder - assuming header is already loaded but just in case */}
            <div className="h-20 border-b border-border/60 bg-white" />

            <div className="h-24 sm:h-28" />

            {/* Sub-nav Skeleton */}
            <div className="hidden md:block w-full border-b border-border/60 bg-white shadow-sm">
                <div className="max-w-[1248px] mx-auto px-4 h-11 flex items-center justify-between">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                        <Skeleton key={i} className="h-4 w-20 rounded" />
                    ))}
                </div>
            </div>

            <main className="flex-1 w-full max-w-[1248px] mx-auto px-4 sm:px-6 py-2">
                {/* Breadcrumbs Skeleton */}
                <div className="flex items-center gap-2 py-3">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-4" />
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-4" />
                    <Skeleton className="h-3 w-32" />
                </div>

                {/* Main Grid Skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-10 mt-2 bg-white p-2">

                    {/* Left Panel: Gallery Skeleton */}
                    <div className="flex flex-col md:flex-row gap-5">
                        <div className="hidden md:flex flex-col gap-2.5">
                            {[1, 2, 3, 4].map((i) => (
                                <Skeleton key={i} className="w-16 h-16 rounded-sm" />
                            ))}
                        </div>
                        <Skeleton className="flex-grow aspect-[4/5] rounded-sm" />
                    </div>

                    {/* Right Panel: Info Skeleton */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-8 w-3/4" />
                        </div>

                        <Skeleton className="h-4 w-20" />

                        <div className="flex items-center gap-4">
                            <Skeleton className="h-10 w-32" />
                            <Skeleton className="h-6 w-20" />
                            <Skeleton className="h-6 w-16" />
                        </div>

                        <div className="flex gap-2">
                            <Skeleton className="h-6 w-24 rounded-full" />
                            <Skeleton className="h-6 w-32 rounded-full" />
                        </div>

                        <div className="space-y-4 pt-8">
                            <Skeleton className="h-6 w-32" />
                            <div className="flex gap-3">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <Skeleton key={i} className="w-14 h-16 rounded-sm" />
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4 pt-8">
                            <Skeleton className="h-6 w-32" />
                            <div className="flex gap-3">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <Skeleton key={i} className="w-12 h-10 rounded-sm" />
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4 pt-8 border-t">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex gap-4">
                                    <Skeleton className="h-5 w-5 rounded-full" />
                                    <Skeleton className="h-5 flex-grow rounded" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
