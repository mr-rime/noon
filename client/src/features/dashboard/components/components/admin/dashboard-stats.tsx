import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Ticket, Package } from "lucide-react"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"

const stats = [
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => {
                const Icon = stat.icon
                const isPositive = stat.trend === "up"
                const TrendIcon = isPositive ? TrendingUp : TrendingDown

                return (
                    <Card key={stat.title} className="bg-card shadow-card transition-shadow hover:shadow-elevated">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="font-medium text-muted-foreground text-sm">
                                {stat.title}
                            </CardTitle>
                            <div className={`rounded-lg p-2 bg-${stat.color}/10`}>
                                <Icon className={`h-4 w-4 text-${stat.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-2 font-bold text-2xl text-foreground">
                                {stat.value}
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge
                                    variant={isPositive ? "default" : "destructive"}
                                    className="flex items-center gap-1 text-xs"
                                >
                                    <TrendIcon className="h-3 w-3" />
                                    {stat.change}
                                </Badge>
                                <span className="text-muted-foreground text-xs">from yesterday</span>
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}