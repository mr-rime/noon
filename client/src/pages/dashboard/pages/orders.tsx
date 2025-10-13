import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { GET_ALL_ORDERS } from '@/graphql/orders'
import { toast } from 'sonner'
import { Search, RefreshCw, Eye, MoreHorizontal, Download } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'
import { Badge } from '../components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/dropdown'
import { AdminOrderDetailsModal } from '../components/admin-order-details-modal'

export function AdminOrdersPage() {
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [paymentStatusFilter, setPaymentStatusFilter] = useState('all')
    const [selectedOrder, setSelectedOrder] = useState<any>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

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
            case 'placed':
                return 'warning'
            case 'processing':
                return 'info'
            case 'confirmed':
                return 'secondary'
            case 'dispatched':
                return 'default'
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

    const exportToCSV = () => {
        const csvHeaders = [
            'Order ID',
            'Customer ID',
            'Status',
            'Payment Status',
            'Total Amount',
            'Currency',
            'Payment Method',
            'Shipping Address',
            'Tracking Number',
            'Shipping Provider',
            'Estimated Delivery',
            'Items Count',
            'Created At',
            'Updated At'
        ]

        const csvData = orders.map((order: any) => [
            order.id,
            order.user_id,
            order.status,
            order.payment_status,
            order.total_amount,
            order.currency,
            order.payment_method,
            (() => {
                try {
                    const addressData = typeof order.shipping_address === 'string'
                        ? JSON.parse(order.shipping_address)
                        : order.shipping_address;

                    const addressLines = [];
                    if (addressData.name) addressLines.push(addressData.name);
                    if (addressData.line1) addressLines.push(addressData.line1);
                    if (addressData.line2) addressLines.push(addressData.line2);

                    const cityStateZip = [];
                    if (addressData.city) cityStateZip.push(addressData.city);
                    if (addressData.state) cityStateZip.push(addressData.state);
                    if (addressData.postal_code) cityStateZip.push(addressData.postal_code);

                    if (cityStateZip.length > 0) {
                        addressLines.push(cityStateZip.join(', '));
                    }

                    if (addressData.country) {
                        addressLines.push(addressData.country);
                    }

                    return addressLines.join(' | ');
                } catch {
                    return order.shipping_address || '';
                }
            })(),
            order.tracking?.tracking_number || '',
            order.tracking?.shipping_provider || '',
            order.tracking?.estimated_delivery_date || '',
            order.items?.length || 0,
            new Date(order.created_at).toLocaleDateString(),
            new Date(order.updated_at).toLocaleDateString()
        ])

        const csvContent = [
            csvHeaders.join(','),
            ...csvData.map((row: any[]) => row.map((cell: any) => `"${cell}"`).join(','))
        ].join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute('download', `orders_management_export_${new Date().toISOString().split('T')[0]}.csv`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        toast.success('Orders exported successfully')
    }

    const handleViewDetails = (order: any) => {
        setSelectedOrder(order)
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setSelectedOrder(null)
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <CardTitle className="text-2xl">Orders Management</CardTitle>
                <div className="flex gap-2">
                    <Button onClick={exportToCSV} variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Export CSV
                    </Button>
                    <Button onClick={() => refetch()} variant="outline">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                    </Button>
                </div>
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
                                <SelectItem value="placed">Placed</SelectItem>
                                <SelectItem value="processing">Processing</SelectItem>
                                <SelectItem value="confirmed">Confirmed</SelectItem>
                                <SelectItem value="dispatched">Dispatched</SelectItem>
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
                                <TableHead>Tracking</TableHead>
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
                                    <TableCell>
                                        {order.tracking?.tracking_number ? (
                                            <div className="text-sm font-mono text-blue-600">
                                                {order.tracking.tracking_number}
                                            </div>
                                        ) : (
                                            <div className="text-sm text-muted-foreground">
                                                No tracking
                                            </div>
                                        )}
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
                                                    onClick={() => handleViewDetails(order)}
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

            {/* Order Details Modal */}
            <AdminOrderDetailsModal
                order={selectedOrder}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            />
        </div>
    )
}
