

type ProgressColorType = "#38AE04" | "#82ae04" | "#F3AC30" | "#F36C32"

type ProgressProps = {
    progressPercentage: string | number
    progressColor?: ProgressColorType
}

export function Progress({ progressPercentage, progressColor = "#38AE04" }: ProgressProps) {
    return (
        <div className="relative bg-[#f3f4f8] min-w-[60px] w-full h-[8px] rounded-[50px] overflow-hidden">
            <div className="absolute  h-full rounded-[50px]" style={{
                width: progressPercentage ?? "100%",
                backgroundColor: progressColor
            }}>
            </div>
        </div>
    )
}
