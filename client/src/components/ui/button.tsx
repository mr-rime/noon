import { cn } from "../../utils/cn"

type ButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className"> & {
    className?: string
    children?: React.ReactNode | React.ReactElement
}

export function Button({ children, className, ...rest }: ButtonProps) {
    return (
        <button {...rest} className={cn("bg-[#3866df] hover:bg-[#3E72F7] transition-colors duration-300 cursor-pointer text-white text-[14px] font-bold h-[48px] rounded-[4px] uppercase px-[32px]", className)}>
            {children}
        </button>
    )
}
