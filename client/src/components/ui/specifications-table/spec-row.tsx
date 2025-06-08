import { cn } from "../../../utils/cn"


type SpecRowProps = {
    specName: string
    specValue: string
    bgColor?: '#EFF3FD' | '#FFF'
    className?: string
}


export function SpecRow({ specName, specValue, bgColor = "#EFF3FD", className }: SpecRowProps) {
    return (
        <tr className={cn(`bg-[${bgColor}]`, className)}>
            <td className="w-[40%] break-words px-[15px] py-[7px] text-[#7e859b] text-[14px]">{specName}</td>
            <td className="w-[60%] break-words px-[15px] py-[7px] text-[14px]">{specValue}</td>
        </tr>
    )
}
