import { BadgeDollarSign, ShoppingBag } from "lucide-react";
import { lazy, Suspense } from "react";
import { RevenueChartSkeleton, TableSkeleton } from "../skeleton-effects";

const LazyRevenueChart = lazy(() => import("./components/revenue-chart/index"));
const LazyOrdersTable = lazy(() => import("./components/orders-table"));

export function DashboardSection() {
	return (
		<section className="px-10 py-20 w-full min-h-screen">
			<h2 className="text-[#131313] text-[30px] font-bold">Dashboard</h2>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-auto mt-10 w-full">
				<div className="w-full bg-white p-5 rounded-[10px]">
					<div className="w-full flex items-center justify-between">
						<span className="text-[20px] font-bold">Total Sales</span>
						<BadgeDollarSign size={22} color="#A8A8A8" />
					</div>
					<div className="text-[25px] font-bold mt-5 flex items-center justify-between">
						<span>$2456</span>
						<span className="text-[14px] text-green-600 font-medium ml-2">+12% from last month</span>
					</div>
				</div>
				<div className="w-full bg-white p-5 rounded-[10px]">
					<div className="w-full flex items-center justify-between">
						<span className="text-[20px] font-bold">Total Orders</span>
						<ShoppingBag size={22} color="#A8A8A8" />
					</div>
					<div className="text-[25px] font-bold mt-5 flex items-center justify-between">
						<span>456</span>
						<span className="text-[14px] text-green-600 font-medium ml-2">+12% from last month</span>
					</div>
				</div>
				<div className="w-full bg-white p-5 rounded-[10px]">
					<div className="w-full flex items-center justify-between">
						<span className="text-[20px] font-bold">Total Sales</span>
						<ShoppingBag size={22} color="#A8A8A8" />
					</div>
					<div className="text-[25px] font-bold mt-5 flex items-center justify-between">
						<span>$2456</span>
						<span className="text-[14px] text-green-600 font-medium ml-2">+12% from last month</span>
					</div>
				</div>
			</div>
			<Suspense fallback={<RevenueChartSkeleton />}>
				<div className="h-[300px] mt-10 w-full bg-white p-5 rounded-[10px]">
					<LazyRevenueChart />
				</div>
			</Suspense>
			<Suspense fallback={<TableSkeleton />}>
				<LazyOrdersTable />
			</Suspense>
		</section>
	);
}
