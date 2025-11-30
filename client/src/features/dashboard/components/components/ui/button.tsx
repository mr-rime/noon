import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/shared/utils/cn"


const buttonVariants = cva(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer',
    {
        variants: {
            variant: {
                default: 'bg-primary text-primary-foreground shadow-card hover:bg-primary-hover hover:shadow-elevated',
                destructive: 'bg-destructive text-destructive-foreground shadow-card hover:bg-destructive/90 hover:shadow-elevated',
                outline: 'border border-input bg-card shadow-card hover:bg-secondary hover:text-secondary-foreground',
                secondary: 'bg-secondary text-secondary-foreground shadow-card hover:bg-secondary-hover',
                ghost: "hover:bg-secondary hover:text-secondary-foreground",
                link: "text-primary underline-offset-4 hover:underline",
                success: 'bg-success text-success-foreground shadow-card hover:bg-success/90 hover:shadow-elevated',
                warning: 'bg-warning text-warning-foreground shadow-card hover:bg-warning/90 hover:shadow-elevated',
                admin: 'bg-gradient-primary font-semibold text-primary-foreground hover:shadow-glow',
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-8 rounded-md px-3 text-xs",
                lg: "h-12 rounded-lg px-8 text-base",
                icon: "h-10 w-10",
                xs: "h-7 rounded px-2 text-xs",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = ({ className, variant, size, asChild = false, ...props }: ButtonProps) => {
    const Comp = asChild ? Slot : "button"
    return (
        <Comp
            className={cn(buttonVariants({ variant, size, className }))}
            {...props}
        />
    )
}
Button.displayName = "Button"

export { Button, buttonVariants }