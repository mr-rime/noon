import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/utils/cn"


const badgeVariants = cva(
    'inline-flex items-center rounded-full border px-2.5 py-0.5 font-semibold text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
    {
        variants: {
            variant: {
                default:
                    "border-transparent bg-[#3c83f6] text-primary-foreground hover:bg-[#3c83f6]/80",
                secondary:
                    "border-transparent bg-[#808080] text-[#808080] hover:bg-[#808080]/80",
                destructive:
                    "border-transparent bg-[#d73a49] text-[#d73a49] hover:bg-[#d73a49]/80",
                success:
                    "border-transparent bg-[#32CD32] text-[#32CD32] hover:bg-[#32CD32]/80",
                warning:
                    "border-transparent bg-[#f97415] text-white hover:bg-[#f97415]/80",
                info:
                    "border-transparent bg-[#6495ED] text-[#6495ED] hover:bg-[#6495ED]/80",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    )
}

export { Badge, badgeVariants }