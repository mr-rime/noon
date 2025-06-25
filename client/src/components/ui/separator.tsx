import type React from "react";
import { memo } from "react";
import { cn } from "../../utils/cn";

interface SeparatorProps {
	className?: string;
}

export const Separator: React.FC<SeparatorProps> = memo(({ className }) => {
	return <div className={cn(` bg-[#EAECF0] w-full h-[1px]`, className)} />;
});
