import { cn } from "../../utils/cn";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string
}

export function Skeleton({ className, ...props }: SkeletonProps) {
    return (
        <div
            className={cn(`relative overflow-hidden bg-[#e4e4e7] w-[50px] h-[10px]`, className)}
            {...props}
        >
            <div className="shimmer-overlay" />
        </div >
    );
}