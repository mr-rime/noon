import { Plus, ArrowRight, AlertTriangle, Clock, Truck, Package } from "lucide-react"
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
} from "recharts"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { DashboardStats } from "../components"

const recentProducts = [
    { id: 1, name: "Wireless Headphones", status: "Active", stock: 45, price: "$99.99" },
    { id: 2, name: "Smart Watch", status: "Active", stock: 12, price: "$249.99" },
    { id: 3, name: "Laptop Stand", status: "Draft", stock: 0, price: "$39.99" },
    { id: 4, name: "USB-C Cable", status: "Active", stock: 156, price: "$19.99" },
]

const expiringOffers = [
    { name: "Summer Sale 20%", expires: "2 days", type: "discount" },
    { name: "Free Shipping", expires: "5 days", type: "coupon" },
    { name: "BOGO Electronics", expires: "1 week", type: "offer" },
]

const upcomingDeliveries = [
    { order: "#ORD-1234", customer: "John Doe", date: "June 14", status: "confirmed" },
    { order: "#ORD-1235", customer: "Jane Smith", date: "June 15", status: "pending" },
    { order: "#ORD-1236", customer: "Bob Wilson", date: "June 16", status: "confirmed" },
]

// Chart data
const salesData = [
    { name: 'Mon', sales: 4000, orders: 24 },
    { name: 'Tue', sales: 3000, orders: 18 },
    { name: 'Wed', sales: 5000, orders: 35 },
    { name: 'Thu', sales: 2800, orders: 20 },
    { name: 'Fri', sales: 6800, orders: 45 },
    { name: 'Sat', sales: 8200, orders: 62 },
    { name: 'Sun', sales: 7500, orders: 48 },
]

const topProducts = [
    { name: 'Wireless Headphones', sales: 156, value: 15600 },
    { name: 'Smart Watch', sales: 98, value: 24500 },
    { name: 'Laptop Stand', sales: 85, value: 3400 },
    { name: 'USB-C Cable', sales: 234, value: 4680 },
    { name: 'Phone Case', sales: 67, value: 2010 },
]

// const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))', 'hsl(var(--info))']

export default function Dashboard() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-bold text-3xl text-foreground">Dashboard Overview</h1>
                    <p className="text-muted-foreground">Welcome back! Here's what's happening with your store today.</p>
                </div>
                <Button variant="admin" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Quick Actions
                </Button>
            </div>

            <DashboardStats />

            {/* Charts Row */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card className="shadow-card">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            Sales Trends
                            <Button variant="ghost" size="sm">
                                View Details <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={salesData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                    <XAxis
                                        dataKey="name"
                                        stroke="hsl(var(--muted-foreground))"
                                        fontSize={12}
                                    />
                                    <YAxis
                                        stroke="hsl(var(--muted-foreground))"
                                        fontSize={12}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--popover))',
                                            border: '1px solid hsl(var(--border))',
                                            borderRadius: '6px'
                                        }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="sales"
                                        stroke="hsl(var(--primary))"
                                        strokeWidth={2}
                                        dot={{ fill: 'hsl(var(--primary))' }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-card">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            Top Selling Products
                            <Button variant="ghost" size="sm">
                                View All <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={topProducts}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                    <XAxis
                                        dataKey="name"
                                        stroke="hsl(var(--muted-foreground))"
                                        fontSize={10}
                                        angle={-45}
                                        textAnchor="end"
                                        height={80}
                                    />
                                    <YAxis
                                        stroke="hsl(var(--muted-foreground))"
                                        fontSize={12}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--popover))',
                                            border: '1px solid hsl(var(--border))',
                                            borderRadius: '6px'
                                        }}
                                    />
                                    <Bar
                                        dataKey="sales"
                                        fill="hsl(var(--primary))"
                                        radius={[4, 4, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="shadow-card">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Package className="h-5 w-5 text-primary" />
                            Recent Products
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {recentProducts.map((product) => (
                            <div key={product.id} className="flex items-center justify-between rounded-lg bg-muted/30 p-3">
                                <div>
                                    <p className="font-medium text-sm">{product.name}</p>
                                    <div className="mt-1 flex items-center gap-2">
                                        <Badge variant={product.status === "Active" ? "default" : "secondary"} className="text-xs">
                                            {product.status}
                                        </Badge>
                                        <span className="text-muted-foreground text-xs">Stock: {product.stock}</span>
                                    </div>
                                </div>
                                <span className="font-semibold text-primary">{product.price}</span>
                            </div>
                        ))}
                        <Button variant="ghost" size="sm" className="mt-3 w-full">
                            View All Products <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </CardContent>
                </Card>

                <Card className="shadow-card">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-warning" />
                            Expiring Soon
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {expiringOffers.map((offer, index) => (
                            <div key={index} className="flex items-center justify-between rounded-lg border border-warning/20 bg-warning/10 p-3">
                                <div>
                                    <p className="font-medium text-sm">{offer.name}</p>
                                    <Badge variant="warning" className="mt-1 text-xs">
                                        {offer.type}
                                    </Badge>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-1 text-warning">
                                        <Clock className="h-3 w-3" />
                                        <span className="font-medium text-xs">{offer.expires}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <Button variant="warning" size="sm" className="mt-3 w-full">
                            Manage Offers <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </CardContent>
                </Card>

                {/* Upcoming Deliveries */}
                <Card className="shadow-card">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Truck className="h-5 w-5 text-info" />
                            Upcoming Deliveries
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {upcomingDeliveries.map((delivery, index) => (
                            <div key={index} className="flex items-center justify-between rounded-lg border border-info/20 bg-info/10 p-3">
                                <div>
                                    <p className="font-medium text-sm">{delivery.order}</p>
                                    <p className="text-muted-foreground text-xs">{delivery.customer}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium text-sm">{delivery.date}</p>
                                    <Badge variant={delivery.status === "confirmed" ? "success" : "secondary"} className="text-xs">
                                        {delivery.status}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                        <Button variant="ghost" size="sm" className="mt-3 w-full">
                            View All Orders <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}