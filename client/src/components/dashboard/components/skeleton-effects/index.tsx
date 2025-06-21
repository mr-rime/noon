import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/utils/cn";

export function RevenueChartSkeleton() {
    return (
        <div className="w-full h-[300px] space-y-2 mt-10 ">
            <Skeleton className="w-full h-full rounded-[10px]" />
        </div>
    )
}


export function TableSkeleton({ className }: { className?: string }) {
    return (
        <div className={cn("w-full h-[300px] space-y-2 mt-10", className)}>
            <Skeleton className="w-full h-full rounded-[10px]" />
        </div>
    )
}
