import { cn } from "../../utils/cn";

type ButtonDirectionType = "left" | "right";
type IconDirectionType = "left" | "right";

type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "className" | "buttonContent"> & {
	className?: string;
	button?: boolean | { content: React.ReactNode };
	buttonDirection?: ButtonDirectionType;
	input?: { className?: string };
	iconDirection?: IconDirectionType;
	icon?: React.ReactElement | React.ReactNode;
	labelContent?: string;
};

export function Input({
	className,
	input,
	button = false,
	icon,
	iconDirection = "left",
	buttonDirection = "right",
	labelContent,
	...rest
}: InputProps) {
	const hasIcon = !!icon;
	const iconLeft = hasIcon && iconDirection === "left";
	const iconRight = hasIcon && iconDirection === "right";
	const isButton = !!button;
	const buttonContent = typeof button === "object" && button.content ? button.content : "apply";

	return (
		<div className={cn("flex", labelContent ? "flex-col items-start gap-2" : "items-center", className)}>
			{labelContent && (
				<label htmlFor={rest.id} className="text-[16px]">
					{labelContent}
				</label>
			)}
			<div className={cn("flex items-center w-full", buttonDirection === "left" ? "flex-row-reverse" : "flex-row")}>
				{isButton && (
					<button
						className={cn(
							"text-[14px] cursor-pointer h-[40px] text-white bg-[#3866df] min-w-[64px] px-[12px] uppercase font-bold",
							buttonDirection === "left" ? "rounded-l-[6px]" : "rounded-r-[6px]",
						)}
					>
						{buttonContent}
					</button>
				)}
				<div className="relative w-full">
					<div className={cn("absolute inset-y-0 flex items-center", iconLeft && "left-3", iconRight && "right-3")}>
						{icon}
					</div>
					<input
						className={cn(
							"text-[16px] w-full border border-[#E2E5F1] outline-none rounded-[6px] px-3",
							"pt-[10px] pb-[10px] leading-[1.2]",
							iconLeft && "pl-10",
							iconRight && "pr-10",
							input?.className,
							isButton && buttonDirection === "left" && "rounded-r-none",
							isButton && buttonDirection === "right" && "rounded-l-none",
						)}
						{...rest}
					/>
				</div>
			</div>
		</div>
	);
}
