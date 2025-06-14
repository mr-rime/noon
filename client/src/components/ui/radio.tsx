import React from "react"
import { cn } from "../../utils/cn"

type RadioProps = {
    label: string
    name: string
    value: string
    checked: boolean
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    description?: string
    className?: string
}

export function Radio({
    label,
    name,
    value,
    checked,
    onChange,
    description,
    className,
}: RadioProps) {
    return (
        <label className={cn("flex items-center gap-3 cursor-pointer", className)}>
            <div className="relative w-5 h-5">
                <input
                    type="radio"
                    name={name}
                    value={value}
                    checked={checked}
                    onChange={onChange}
                    className="peer sr-only"
                />
                <div
                    className={cn(
                        "w-full h-full rounded-full border-1 transition-all duration-200",
                        checked ? "bg-blue-600 border-blue-600" : "bg-white border-[#DCDEE5]",
                        "flex items-center justify-center"
                    )}
                >
                    <div
                        className={cn(
                            "w-1.5 h-1.5 rounded-full bg-white transition-opacity duration-200",
                            checked ? "opacity-100" : "opacity-0"
                        )}
                    />
                </div>
            </div>
            <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-900">{label}</span>
                {description && <span className="text-xs text-gray-500">{description}</span>}
            </div>
        </label>
    )
}
