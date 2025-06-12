import { cn } from "../../utils/cn"

type ButtonDirectionType = "left" | "right"
type IconDirectionType = "left" | "right"

type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "className" | "buttonContent"> & {
    className?: string
    button?: boolean | { content: React.ReactNode }
    buttonDirection?: ButtonDirectionType
    input?: { className: string }
    iconDirection?: IconDirectionType
    icon?: React.ReactElement | React.ReactNode
}

export function Input({ className, input, button = false, icon, iconDirection, buttonDirection = "right", ...rest }: InputProps) {
    return (
        <div className={cn("relative flex items-center", className, buttonDirection === "left" ? "flex-row-reverse" : "flex-row")}>
            <div className={cn(`absolute top-1/2 transform -translate-y-1/2 ${iconDirection}-[7px] w-fit`)}>
                {icon}
            </div>
            <input className={cn("text-[16px] w-full h-[40px] outline-none border indent-1 border-[#E2E5F1] py-[10px] px-[10px]", input?.className, (icon && (iconDirection === "left" || iconDirection === "right")) && "px-[25px]", (button && buttonDirection === "left") ? "rounded-r-[6px]" : (button && buttonDirection === "right") && "rounded-l-[6px]")} {...rest} />
            {button && <button className={cn("text-[14px] cursor-pointer h-[39px] text-white bg-[#3866df] min-w-[64px] p-[10px] uppercase font-bold ", (button && buttonDirection === "left") ? "rounded-l-[6px]" : "rounded-r-[6px]")}>apply</button>}
        </div>
    )
}