import type React from "react";
import { cn } from "../../utils/cn";

type SwitchProps = {
	label?: string;
	checked: boolean;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	description?: string;
	className?: string;
	disabled?: boolean;
	name?: string;
};

export function Switch({ label, checked, onChange, description, className, disabled = false, name }: SwitchProps) {
	return (
		<div className={cn("flex items-start gap-3", className)}>
			<div className="flex items-center h-6">
				<label
					className={cn(
						"relative inline-flex w-11 h-6 items-center rounded-full transition-colors duration-200",
						disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
					)}
				>
					<input
						type="checkbox"
						name={name}
						checked={checked}
						onChange={onChange}
						disabled={disabled}
						className="sr-only peer"
					/>
					<span
						className={cn(
							"absolute inset-0 rounded-full transition-colors",
							checked ? "bg-blue-600" : "bg-gray-300",
							!disabled && "peer-focus:ring-2 peer-focus:ring-blue-300",
						)}
					/>
					<span
						className={cn(
							"absolute left-[2px] top-[2px] h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-200",
							checked ? "translate-x-[20px]" : "translate-x-0",
						)}
					/>
				</label>
			</div>
			<div className="flex flex-col">
				<span className="text-sm font-medium text-gray-900">{label}</span>
				{description && <span className="text-xs text-gray-500">{description}</span>}
			</div>
		</div>
	);
}
