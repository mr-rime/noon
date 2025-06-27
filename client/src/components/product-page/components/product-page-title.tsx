import { cn } from "@/utils/cn";

export function ProductPageTitle({ title, className, children }: { title: string; className?: string; children?: React.ReactNode }) {
	return (
		<>
			<h1 className={cn("text-[1.6em] font-semibold text-[#1d2939]", className)}>{title}</h1>
			{children}
		</>
	);
}
