import { Skeleton } from "@/components/ui/skeleton";

export function ProductSkeleton() {
    return (
        <article className="w-full shrink-0 select-none max-w-[230px] h-[467px] rounded-[12px] border border-[#DDDDDD] p-2 overflow-x-hidden bg-white">
            <div className="w-full h-full flex flex-col gap-2">
                <Skeleton className="h-[200px] w-full rounded-[8px]" />
                <Skeleton className="h-[20px] w-[80%] rounded" />
                <Skeleton className="h-[20px] w-[60%] rounded" />
                <Skeleton className="h-[24px] w-[50px] rounded-full" />
            </div>
        </article>
    );
}
