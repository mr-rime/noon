import { useNavigate } from "@tanstack/react-router";
import { Plus, Search } from "lucide-react";
import { lazy, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableSkeleton } from "../../../skeleton-effects";

const LazyProductsTable = lazy(() => import("../products-table/"));

export function ProductsTableWrapper() {
	const navigate = useNavigate();
	return (
		<div className="w-full mt-10">
			<div className="p-6 w-full mx-auto mt-5 rounded-2xl bg-white min-h-[300px]">
				<div className="w-full flex items-center justify-between space-x-3 mb-6">
					<Input
						placeholder="Search"
						icon={<Search size={17} color="#71717B" />}
						input={{ className: "rounded-[10px]" }}
						iconDirection="right"
					/>
					<Button
						onClick={() => navigate({ to: "/dashboard/products/new" })}
						className="h-[40px] rounded-[10px] flex items-center space-x-1 capitalize font-semibold text-white"
					>
						<Plus />
						<span>Add Product</span>
					</Button>
				</div>
				<Suspense fallback={<TableSkeleton className="h-[400px]" />}>
					<LazyProductsTable />
				</Suspense>
			</div>
		</div>
	);
}
