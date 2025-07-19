import { Skeleton } from "@/components/ui/skeleton";

export function ProductPageLoadingSkeleton() {
	return (
		<main aria-label="Product Page" className="bg-[#F7F7FA] overflow-x-hidden mb-32 !scroll-smooth">
			<section
				aria-labelledby="product-main-section"
				className="site-container relative w-full flex flex-col lg:flex-row items-start justify-start pt-10 space-y-10 lg:space-y-0 lg:space-x-10 px-5 "
			>
				<div className="md:w-[calc(300/1200*100%)]  w-full">
					<Skeleton className="h-[50px] w-full rounded-[6px] mb-5 max-md:block hidden" />
					<Skeleton className="h-[450px] w-full rounded-[6px]" />
				</div>

				<div
					className="flex flex-col items-start gap-3 justify-center w-full lg:w-[calc(500/1200*100%)]"
					aria-labelledby="product-info-section"
				>
					<Skeleton className="h-[30px] w-full rounded-[6px]" />
					<Skeleton className="h-[25px] w-full rounded-[6px]" />
					<Skeleton className="h-[25px] w-full rounded-[6px]" />
					<Skeleton className="h-[50px] w-[150px] max-md:w-full rounded-[6px] mt-8" />
					<Skeleton className="h-[50px] w-[150px] max-md:w-full rounded-[6px] " />
				</div>
				<div className="hidden md:block">
					<div className="flex items-center space-x-2 mt-2">
						<Skeleton className="h-[25px] w-full rounded-[6px]" />
					</div>
				</div>
				<div className="space-y-3 max-md:hidden block">
					<Skeleton className="h-[350px] w-[300px] rounded-[6px]" />
					<Skeleton className="h-[45px] w-full rounded-[6px]" />
				</div>
			</section>
		</main>
	);
}
