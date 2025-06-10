import { cn } from "../../utils/cn"

type buttonDirectionType = "left" | "right"

type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "className" | "buttonContent"> & {
    className?: string
    button?: false | { content: React.ReactNode }
    buttonDirection?: buttonDirectionType
    input?: { className: string }
}

export function Input({ className, input, buttonDirection = "right", ...rest }: InputProps) {
    return (
        <div className={cn("flex items-center", className, buttonDirection === "left" ? "flex-row-reverse" : "flex-row")}>
            <input className={cn("text-[16px] w-full h-[40px] outline-none border indent-1 border-[#E2E5F1] p-[10px]", input?.className, buttonDirection === "left" ? "rounded-r-[6px]" : " rounded-l-[6px]")} {...rest} />
            <button className={cn("text-[14px] cursor-pointer h-[39px] text-white bg-[#3866df] min-w-[64px] p-[10px] uppercase font-bold ", buttonDirection === "left" ? "rounded-l-[6px]" : "rounded-r-[6px]")}>apply</button>
        </div>
    )
}