import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { DashboardStats } from './components'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, ArrowRight, Clock, Package, Truck } from 'lucide-react'
import { Button } from '@/components/ui/button'


const salesData = [
  { name: 'Mon', sales: 4000, orders: 24 },
  { name: 'Tue', sales: 3000, orders: 18 },
  { name: 'Wed', sales: 5000, orders: 35 },
  { name: 'Thu', sales: 2800, orders: 20 },
  { name: 'Fri', sales: 6800, orders: 45 },
  { name: 'Sat', sales: 8200, orders: 62 },
  { name: 'Sun', sales: 7500, orders: 48 },
]


const recentProducts = [
  { id: 1, name: "Wireless Headphones", status: "Active", stock: 45, price: "$99.99" },
  { id: 2, name: "Smart Watch", status: "Active", stock: 12, price: "$249.99" },
  { id: 3, name: "Laptop Stand", status: "Draft", stock: 0, price: "$39.99" },
  { id: 4, name: "USB-C Cable", status: "Active", stock: 156, price: "$19.99" },
]

const topProducts = [
  { name: 'Wireless Headphones', sales: 156, value: 15600 },
  { name: 'Smart Watch', sales: 98, value: 24500 },
  { name: 'Laptop Stand', sales: 85, value: 3400 },
  { name: 'USB-C Cable', sales: 234, value: 4680 },
  { name: 'Phone Case', sales: 67, value: 2010 },
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

export function DashboardOverview() {
  return (
    <section className="min-h-screen w-full px-10 py-5">
      <h2 className="font-bold text-[#131313] text-[30px]">Dashboard Overview</h2>
      <p className="text-[#5a7396]">
        Welcome back! Here's what's happening with your store today.
      </p>
      <DashboardStats />
      <div className="mt-5 grid gap-6 md:grid-cols-2">
        <div className="rounded-[10px] border border-[#e4e4e7] p-6 shadow-card ">
          <h3 className="mb-4 font-bold text-[#131313] text-[24px]">
            Sales Trends
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(240 6% 90%)" />
                <XAxis
                  dataKey="name"
                  stroke="hsl(240 6% 90%)"
                  fontSize={12}
                />
                <YAxis
                  stroke="hsl(240 6% 90%)"
                  fontSize={12}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(240 6% 90%)',
                    border: '1px solid hsl(240 6% 90%)',
                    borderRadius: '6px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="hsl(217 91% 60%)"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(217 91% 60%)' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-[10px] border border-[#e4e4e7] p-6 shadow-card">
          <h3 className="mb-4 font-bold text-[#131313] text-[24px]">
            Top Selling Products
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProducts}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(240 6% 90%)" />
                <XAxis
                  dataKey="name"
                  stroke="hsl(240 6% 90%)"
                  fontSize={10}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis
                  stroke="hsl(240 6% 90%)"
                  fontSize={12}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(240 6% 90%)',
                    border: '1px solid hsl(240 6% 90%)',
                    borderRadius: '6px'
                  }}
                />
                <Bar
                  dataKey="sales"
                  fill="hsl(217 91% 60%)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-6 md:grid-cols-3">
        <div className="rounded-xl bg-white shadow-card">
          <div className="border-b p-4">
            <h3 className="flex items-center gap-2 font-semibold text-lg">
              <Package className="h-5 w-5 text-primary" />
              Recent Products
            </h3>
          </div>
          <div className="space-y-3 p-4">
            {recentProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between rounded-lg bg-muted/30 p-3"
              >
                <div>
                  <p className="font-medium text-sm">{product.name}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge
                      variant={product.status === "Active" ? "default" : "secondary"}
                      className="text-white text-xs"
                    >
                      {product.status}
                    </Badge>
                    <span className="text-muted-foreground text-xs">
                      Stock: {product.stock}
                    </span>
                  </div>
                </div>
                <span className="font-semibold text-primary">{product.price}</span>
              </div>
            ))}
            <Button className="mt-3 w-full">
              View All Products <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="rounded-xl bg-white shadow-card">
          <div className="border-b p-4">
            <h3 className="flex items-center gap-2 font-semibold text-lg">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Expiring Soon
            </h3>
          </div>
          <div className="space-y-3 p-4">
            {expiringOffers.map((offer, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border border-warning/20 bg-warning/10 p-3"
              >
                <div>
                  <p className="font-medium text-sm">{offer.name}</p>
                  <Badge variant="warning" className="mt-1 text-white text-xs">
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
            <Button className="mt-3 w-full">
              Manage Offers <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Upcoming Deliveries */}
        <div className="rounded-xl bg-white shadow-card">
          <div className="border-b p-4">
            <h3 className="flex items-center gap-2 font-semibold text-lg">
              <Truck className="h-5 w-5 text-info" />
              Upcoming Deliveries
            </h3>
          </div>
          <div className="space-y-3 p-4">
            {upcomingDeliveries.map((delivery, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border border-info/20 bg-info/10 p-3"
              >
                <div>
                  <p className="font-medium text-sm">{delivery.order}</p>
                  <p className="text-muted-foreground text-xs">{delivery.customer}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-sm">{delivery.date}</p>
                  <Badge
                    variant={
                      delivery.status === "confirmed" ? "success" : "secondary"
                    }
                    className="text-white text-xs"
                  >
                    {delivery.status}
                  </Badge>
                </div>
              </div>
            ))}
            <Button className="mt-3 w-full">
              View All Orders <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

    </section>
  );
}

