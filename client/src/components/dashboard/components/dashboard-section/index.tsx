import { BadgeDollarSign, ShoppingBag } from "lucide-react";
import { lazy, Suspense } from "react";
import RevenueChartSkeleton from "./components/revenue-chart/components/revenue-chart-skeleton";
import { Table } from "@/components/ui/table";
import { cn } from "@/utils/cn";


const LazyRevenueChart = lazy(() => import("./components/revenue-chart/index"))

type Order = {
    number: string
    date: string
    customer: string
    items: number
    paid: boolean
    status: string
    total: number
};

const orders: Order[] = [
    {
        number: "001",
        date: "25/12/2022",
        customer: "John Doe",
        items: 1,
        paid: true,
        status: "Delivered",
        total: 245.99,
    },
    {
        number: "002",
        date: "25/12/2022",
        customer: "Jane Doe",
        items: 1,
        paid: false,
        status: "Delivered",
        total: 245.99,
    },
    {
        number: "003",
        date: "25/12/2022",
        customer: "John Doe",
        items: 1,
        paid: true,
        status: "Delivered",
        total: 245.99,
    },
    {
        number: "004",
        date: "25/12/2022",
        customer: "Jane Doe",
        items: 1,
        paid: false,
        status: "Delivered",
        total: 245.99,
    },
    {
        number: "005",
        date: "25/12/2022",
        customer: "John Doe",
        items: 1,
        paid: true,
        status: "Delivered",
        total: 245.99,
    },
    {
        number: "006",
        date: "25/12/2022",
        customer: "Jane Doe",
        items: 1,
        paid: false,
        status: "Delivered",
        total: 245.99,
    },
    {
        number: "007",
        date: "25/12/2022",
        customer: "John Doe",
        items: 1,
        paid: true,
        status: "Delivered",
        total: 245.99,
    },
    {
        number: "008",
        date: "25/12/2022",
        customer: "Jane Doe",
        items: 1,
        paid: true,
        status: "Delivered",
        total: 245.99,
    },
    {
        number: "009",
        date: "25/12/2022",
        customer: "John Doe",
        items: 1,
        paid: true,
        status: "Delivered",
        total: 245.99,
    },
    {
        number: "010",
        date: "25/12/2022",
        customer: "Jane Doe",
        items: 1,
        paid: true,
        status: "Delivered",
        total: 245.99,
    },
];

export function DashboardSection() {
    return (
        <section className="p-10 w-full min-h-screen">
            <h2 className="text-[#131313] text-[30px] font-bold">
                Dashboard
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-auto mt-10 w-full">
                <div className="w-full bg-white p-5 rounded-[10px]">
                    <div className="w-full flex items-center justify-between">
                        <span className="text-[20px] font-bold">Total Sales</span>
                        <BadgeDollarSign size={22} color="#A8A8A8" />
                    </div>
                    <div className="text-[25px] font-bold mt-5 flex items-center justify-between">
                        <span>$2456</span>
                        <span className="text-[14px] text-green-600 font-medium ml-2">
                            +12% from last month
                        </span>
                    </div>
                </div>
                <div className="w-full bg-white p-5 rounded-[10px]">
                    <div className="w-full flex items-center justify-between">
                        <span className="text-[20px] font-bold">Total Orders</span>
                        <ShoppingBag size={22} color="#A8A8A8" />
                    </div>
                    <div className="text-[25px] font-bold mt-5 flex items-center justify-between">
                        <span>456</span>
                        <span className="text-[14px] text-green-600 font-medium ml-2">
                            +12% from last month
                        </span>
                    </div>
                </div>
                <div className="w-full bg-white p-5 rounded-[10px]">
                    <div className="w-full flex items-center justify-between">
                        <span className="text-[20px] font-bold">Total Sales</span>
                        <ShoppingBag size={22} color="#A8A8A8" />
                    </div>
                    <div className="text-[25px] font-bold mt-5 flex items-center justify-between">
                        <span>$2456</span>
                        <span className="text-[14px] text-green-600 font-medium ml-2">
                            +12% from last month
                        </span>
                    </div>
                </div>
            </div>
            <Suspense fallback={<RevenueChartSkeleton />}>
                <div className="h-[300px] mt-10 w-full bg-white p-5 rounded-[10px]">
                    <LazyRevenueChart />
                </div>
            </Suspense>
            <div className="p-6 w-full mx-auto mt-5 rounded-2xl bg-white min-h-[300px]">
                <h3 className="mb-5 font-bold text-[20px]">
                    Recent Orders
                </h3>
                <Table<Order>
                    data={orders}
                    columns={[
                        { key: "number", header: "No.", sortable: true },
                        { key: "date", header: "Date", sortable: true },
                        { key: "customer", header: "Customer" },
                        {
                            key: "items",
                            header: "Items",
                            sortable: true,
                            render: row => <span>{row.items} Items</span>,
                        },
                        {
                            key: "paid",
                            header: "Paid",
                            render: row => <span className={cn("px-3 py-1 rounded-[7px]", row.paid ? "bg-[#E7F7ED] text-[#149345]" : "bg-[#FDEED8] text-[#DC7745]")}>{row.paid ? "Yes" : "No"}</span>
                        },
                        {
                            key: "status",
                            header: "Status",
                        },
                        {
                            key: "total",
                            header: "Total",
                            render: row => (<span>${row.total.toFixed(2)}</span>)
                        }
                    ]}
                    pageSize={5}
                />
            </div>
        </section>
    )
}
