import { DollarSign, Package, ShoppingCart, Ticket } from "lucide-react"
import { Stat, type StatProps } from "./components/stat"

const stats: StatProps[] = [
    {
        title: "Total Sales Today",
        value: "$12,459",
        change: "+12.5%",
        trend: "up",
        icon: DollarSign,
        color: "success"
    },
    {
        title: "Total Orders",
        value: "1,247",
        change: "+8.2%",
        trend: "up",
        icon: ShoppingCart,
        color: "primary"
    },
    {
        title: "Active Coupons",
        value: "24",
        change: "-2",
        trend: "down",
        icon: Ticket,
        color: "warning"
    },
    {
        title: "Low Stock Products",
        value: "12",
        change: "+3",
        trend: "down",
        icon: Package,
        color: "destructive"
    }
]
export function DashboardStats() {
    return (
        <div className="mt-10 grid w-full auto-rows-auto grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, i) => (
                <Stat key={i} {...stat} />
            ))}
        </div>
    )
}
