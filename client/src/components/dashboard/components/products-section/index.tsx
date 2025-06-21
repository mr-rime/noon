
import { lazy, Suspense } from "react";
import { TableSkeleton } from "../skeleton-effects";
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const LazyProductsTable = lazy(() => import("./components/products-table"))

export function ProductsSection() {
    return (
        <section className="px-10 py-20 w-full min-h-screen">
            <div className="flex items-center justify-between">
                <h2 className="text-[#131313] text-[30px] font-bold">
                    Products List
                </h2>
            </div>

            <div className="w-full mt-10">
                <div className="p-6 w-full mx-auto mt-5 rounded-2xl bg-white min-h-[300px]">
                    <div className="w-full flex items-center justify-between space-x-3 mb-6">
                        <Input placeholder="Search" icon={<Search size={17} color="#71717B" />} input={{ className: "rounded-[10px]" }} iconDirection="right" />
                        <Button className="h-[40px] rounded-[10px] flex items-center space-x-1 capitalize font-semibold text-white">
                            <Plus /><span>Add Product</span>
                        </Button>
                    </div>
                    <Suspense fallback={<TableSkeleton className="h-[400px]" />}>
                        <LazyProductsTable />
                    </Suspense>
                </div>
            </div>
        </section>
    )
}