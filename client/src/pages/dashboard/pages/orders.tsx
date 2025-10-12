import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { GET_ALL_ORDERS } from '@/graphql/orders'
import { toast } from 'sonner'
import { Search, RefreshCw, Eye, MoreHorizontal } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'
import { Badge } from '../components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/dropdown'

export function AdminOrdersPage() {
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [paymentStatusFilter, setPaymentStatusFilter] = useState('all')

    const { data, loading, error, refetch } = useQuery(GET_ALL_ORDERS, {
        variables: {
            limit: 100,
            offset: 0,
            status: statusFilter !== 'all' ? statusFilter : null,
            payment_status: paymentStatusFilter !== 'all' ? paymentStatusFilter : null
        }
    })

    if (loading) {
        return (
            <div className="p-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Orders Management</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="h-20 bg-muted animate-pulse rounded" />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (error) {
        toast.error('Failed to load orders')
        return (
            <div className="p-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Orders Management</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-destructive">Failed to load orders. Please try again.</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const orders = data?.getAllOrders?.orders || []

    const filteredOrders = orders.filter((order: any) => {
        const matchesSearch = searchTerm === '' ||
            order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.items?.some((item: any) =>
                item.product_name?.toLowerCase().includes(searchTerm.toLowerCase())
            )

        const matchesStatus = statusFilter === 'all' || order.status === statusFilter
        const matchesPaymentStatus = paymentStatusFilter === 'all' || order.payment_status === paymentStatusFilter

        return matchesSearch && matchesStatus && matchesPaymentStatus
    })

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'pending':
                return 'warning'
            case 'processing':
                return 'info'
            case 'shipped':
                return 'secondary'
            case 'delivered':
                return 'success'
            case 'cancelled':
                return 'destructive'
            default:
                return 'default'
        }
    }

    const getPaymentStatusVariant = (status: string) => {
        switch (status) {
            case 'paid':
                return 'success'
            case 'unpaid':
                return 'destructive'
            case 'refunded':
                return 'secondary'
            default:
                return 'default'
        }
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <CardTitle className="text-2xl">Orders Management</CardTitle>
                <Button onClick={() => refetch()} variant="outline">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                </Button>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                            <Input
                                type="text"
                                placeholder="Search orders..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="All Statuses" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="processing">Processing</SelectItem>
                                <SelectItem value="shipped">Shipped</SelectItem>
                                <SelectItem value="delivered">Delivered</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="All Payment Statuses" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Payment Statuses</SelectItem>
                                <SelectItem value="paid">Paid</SelectItem>
                                <SelectItem value="unpaid">Unpaid</SelectItem>
                                <SelectItem value="refunded">Refunded</SelectItem>
                            </SelectContent>
                        </Select>

                        <div className="text-sm text-muted-foreground flex items-center">
                            Showing {filteredOrders.length} of {orders.length} orders
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Orders Table */}
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order ID</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Items</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Payment</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredOrders.map((order: any) => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-medium">
                                        {order.id}
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm">
                                            User ID: {order.user_id}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm">
                                            {order.items?.length || 0} item(s)
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {order.items?.[0]?.product_name || 'No items'}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium">
                                            {order.currency} {order.total_amount.toFixed(2)}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusVariant(order.status)}>
                                            {order.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={getPaymentStatusVariant(order.payment_status)}>
                                            {order.payment_status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {formatDate(order.created_at)}
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        window.open(`/orders/track/order/${order.id}`, '_blank')
                                                    }}
                                                >
                                                    <Eye className="w-4 h-4 mr-2" />
                                                    View Details
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {filteredOrders.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">No orders found matching your criteria</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
