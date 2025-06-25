import { cn } from "../../../../../utils/cn";

type StatusNameType = "Placed" | "Processing" | "Confirmed" | "Dispatched" | "Delivery";

type TimelineStatusProps = {
	icon: React.ReactNode | React.ReactElement;
	statusName: StatusNameType;
	statusDate: string;
	deliveryByDate?: string;
	isCurrent?: boolean;
	statusDesc?: string;
	isLast?: boolean;
	isCompleted?: boolean;
};

export function TimelineStatus({
	icon,
	statusName,
	statusDate,
	deliveryByDate,
	isCurrent = false,
	statusDesc,
	isLast = false,
	isCompleted = false,
}: TimelineStatusProps) {
	return (
		<div className={cn("relative grid grid-cols-[auto_1fr] gap-[12px]", isCurrent ? "h-auto" : "h-[48px]")}>
			<div
				className={cn(
					"relative z-[2]  w-[32px] aspect-square rounded-full flex items-center justify-center",
					!isCurrent && "border-[4px] border-white",
					isCompleted ? "bg-[#38ae04]" : "bg-white",
				)}
			>
				<div className={cn(isCurrent && "scale-[1.3]")}>{icon}</div>
			</div>
			<div className="flex flex-col">
				<div className="space-x-2">
					<span className={cn(isCurrent ? "text-[19px] text-[#38ae04] font-bold" : "text-[16px]")}>
						{statusName} {deliveryByDate && `by ${deliveryByDate}`}
					</span>
					<span className="text-[12px] text-[#7e859b]">on {statusDate}</span>
				</div>
				{isCurrent && (
					<div className="mb-5">
						<span className="text-[19px] font-[500]">on time</span>
						<p className="text-[14px] w-full">{statusDesc}</p>
					</div>
				)}
			</div>
			{!isLast && (
				<div
					className={cn(
						"z-[1] absolute top-0 left-[15px] w-[2px] h-full   transition-all",
						isCurrent && "animate-timeline h-0",
						isCompleted ? "bg-[#38ae04]" : "bg-[#dadce3]",
					)}
				/>
			)}
			{isCurrent && <div className="absolute top-0 left-[15px] w-[2px] h-full bg-[#dadce3]" />}
		</div>
	);
}
