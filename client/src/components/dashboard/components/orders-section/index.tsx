import { lazy, Suspense } from "react";
import { TableSkeleton } from "../skeleton-effects";

const LazyOrdersTable = lazy(() => import("../dashboard-section/components/orders-table"));

export default function OrdersSection() {
	return (
		<section className="px-10 py-20 w-full min-h-screen">
			<div className="flex items-center justify-between">
				<h2 className="text-[#131313] text-[30px] font-bold">Orders List</h2>
			</div>

			<div className="w-full mt-10">
				<Suspense fallback={<TableSkeleton />}>
					<LazyOrdersTable />
				</Suspense>
			</div>
		</section>
	);
}
