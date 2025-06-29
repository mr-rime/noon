import { useNavigate, useSearch } from "@tanstack/react-router";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProductsTable from "../products-table";
import { useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";

export function ProductsTableWrapper() {
	const navigate = useNavigate({ from: "/dashboard/products" });
	const { q: searchQuery = "" } = useSearch({ from: "/(dashboard)/_dashboardLayout/dashboard/products/" });

	const [inputValue, setInputValue] = useState(searchQuery);

	const handleSearch = useDebounce((value: string) => {
		navigate({ search: { q: value || "" } });
	}, 400);

	return (
		<div className="w-full mt-10">
			<div className="p-6 w-full mx-auto mt-5 rounded-2xl bg-white min-h-[300px]">
				<div className="w-full flex items-center justify-between space-x-3 mb-6">
					<Input
						placeholder="Search"
						icon={<Search size={17} color="#71717B" />}
						input={{ className: "rounded-[10px]" }}
						iconDirection="right"
						value={inputValue}
						onChange={(e) => {
							const val = e.target.value;
							setInputValue(val);
							handleSearch(val);
						}}
					/>
					<Button
						onClick={() => navigate({ to: "/dashboard/products/new" })}
						className="h-[40px] rounded-[10px] flex items-center space-x-1 capitalize font-semibold text-white"
					>
						<Plus />
						<span>Add Product</span>
					</Button>
				</div>
				<ProductsTable search={searchQuery} />
			</div>
		</div>
	);
}
