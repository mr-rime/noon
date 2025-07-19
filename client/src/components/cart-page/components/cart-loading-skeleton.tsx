import { Skeleton } from "@/components/ui/skeleton";

export function CartLoadingSkeleton() {
	return (
		<main className="w-full h-full site-container py-2 mt-10 px-[45px]">
			<h1 className="flex items-center space-x-1">
				<strong className="text-[23px]">Cart</strong>
			</h1>

			<section className="flex items-start justify-center w-full space-x-7 mt-5">
				<section className=" w-full max-w-[65%] flex flex-col items-center gap-3">
					<Skeleton className="h-[30px] w-full rounded-[6px]" />
					<Skeleton className="h-[200px] w-full rounded-[6px]" />
					<Skeleton className="h-[200px] w-full rounded-[6px]" />
				</section>

				<section className="rounded-[6px]  rounded-t-none flex flex-col items-center  gap-3 p-[0px_20px] sticky w-full max-w-[35%]">
					<Skeleton className="h-[30px] w-full rounded-[6px]" />
					<Skeleton className="h-[300px] w-full rounded-[6px]" />
					<Skeleton className="h-[100px] w-full rounded-[6px]" />
				</section>
			</section>
		</main>
	);
}
