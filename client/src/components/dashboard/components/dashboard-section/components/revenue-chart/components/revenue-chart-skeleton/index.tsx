import { Skeleton } from "@/components/ui/skeleton";

export default function RevenueChartSkeleton() {
    return (
        <div className="w-full h-[300px] space-y-2 mt-10 ">
            <Skeleton className="w-full h-full rounded-[10px]" />
        </div>
    )
}
