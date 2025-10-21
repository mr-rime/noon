import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { GET_ALL_ORDERS, UPDATE_TRACKING_DETAILS } from '@/graphql/orders'
import { toast } from 'sonner'
import { Search, Package, Truck, RefreshCw, Loader2, Download } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Badge } from '../components/ui/badge'

export function AdminTrackingPage() {
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedOrder, setSelectedOrder] = useState<any>(null)
    const [isUpdating, setIsUpdating] = useState(false)
    const [trackingForm, setTrackingForm] = useState({
        shipping_provider: 'Standard Shipping',
        tracking_number: '',
        status: 'processing',
        estimated_delivery_date: ''
    })

    const { data, loading, error, refetch } = useQuery(GET_ALL_ORDERS, {
        variables: {
            limit: 100,
            offset: 0
        }
    })

    const [updateTracking] = useMutation(UPDATE_TRACKING_DETAILS, {
        onCompleted: (data) => {
            setIsUpdating(false)
            if (data.updateTrackingDetails.success) {
                toast.success('Tracking details updated successfully')
                refetch()
                setSelectedOrder(null)
            } else {
                toast.error(data.updateTrackingDetails.message)
            }
        },
        onError: (error) => {
            setIsUpdating(false)
            toast.error('Failed to update tracking details')
            console.error(error)
        }
    })

    if (loading) {
        return (
            <div className="p-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Tracking Management</CardTitle>
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
                        <CardTitle>Tracking Management</CardTitle>
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

        return matchesSearch
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

    const handleUpdateTracking = () => {
        if (!selectedOrder || isUpdating) return

        setIsUpdating(true)
        updateTracking({
            variables: {
                order_id: selectedOrder.id,
                ...trackingForm
            }
        })
    }

    const handleSelectOrder = (order: any) => {
        setSelectedOrder(order)


        const defaultDeliveryDate = new Date()
        defaultDeliveryDate.setDate(defaultDeliveryDate.getDate() + 7)
        const formattedDefaultDate = defaultDeliveryDate.toISOString().split('T')[0]

        if (order.tracking) {
            setTrackingForm({
                shipping_provider: order.tracking.shipping_provider || 'Standard Shipping',
                tracking_number: order.tracking.tracking_number || `TRK${order.id.slice(-8).toUpperCase()}`,
                status: order.tracking.status || order.status || 'processing',
                estimated_delivery_date: order.tracking.estimated_delivery_date || formattedDefaultDate
            })
        } else {
            setTrackingForm({
                shipping_provider: 'Standard Shipping',
                tracking_number: `TRK${order.id.slice(-8).toUpperCase()}`,
                status: order.status || 'processing',
                estimated_delivery_date: formattedDefaultDate
            })
        }
    }

    const exportToCSV = () => {
        const csvHeaders = [
            'Order ID',
            'Status',
            'Payment Status',
            'Total Amount',
            'Currency',
            'Payment Method',
            'Tracking Number',
            'Shipping Provider',
            'Estimated Delivery',
            'Items Count',
            'Created At',
            'Updated At'
        ]

        const csvData = orders.map((order: any) => [
            order.id,
            order.status,
            order.payment_status,
            order.total_amount,
            order.currency,
            order.payment_method,
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
        link.setAttribute('download', `orders_export_${new Date().toISOString().split('T')[0]}.csv`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        toast.success('Orders exported successfully')
    }

    return (
        <div className="p-6 space-y-6">

            <div className="flex justify-between items-center">
                <CardTitle className="text-2xl">Tracking Management</CardTitle>
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                <Card>
                    <CardHeader>
                        <CardTitle>Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="relative mb-4">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                            <Input
                                type="text"
                                placeholder="Search orders..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        <div className="max-h-[600px] overflow-y-auto space-y-2">
                            {filteredOrders.map((order: any) => (
                                <div
                                    key={order.id}
                                    onClick={() => handleSelectOrder(order)}
                                    className={`p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${selectedOrder?.id === order.id ? 'bg-primary/5 border-primary' : ''
                                        }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h3 className="font-medium">Order #{order.id}</h3>
                                            <p className="text-sm text-muted-foreground">{order.items?.length || 0} item(s)</p>
                                            <p className="text-sm text-muted-foreground">{formatDate(order.created_at)}</p>
                                            {order.tracking?.tracking_number && (
                                                <p className="text-xs text-blue-600 font-mono mt-1">
                                                    Tracking: {order.tracking.tracking_number}
                                                </p>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <Badge variant={getStatusVariant(order.status)}>
                                                {order.status}
                                            </Badge>
                                            <p className="text-sm font-medium mt-1">{order.currency} {order.total_amount.toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {filteredOrders.length === 0 && (
                                <div className="text-center py-12">
                                    <p className="text-muted-foreground">No orders found matching your criteria</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>


                <Card>
                    <CardContent className="pt-6">
                        {selectedOrder ? (
                            <div className="relative">
                                {isUpdating && (
                                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
                                        <div className="flex items-center space-x-2 text-primary">
                                            <Loader2 className="w-6 h-6 animate-spin" />
                                            <span className="text-lg font-medium">Updating tracking details...</span>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center space-x-2 mb-6">
                                    <Package className="text-primary" size={20} />
                                    <h2 className="text-lg font-semibold">Update Tracking - Order #{selectedOrder.id}</h2>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Shipping Provider
                                        </label>
                                        <Input
                                            type="text"
                                            value={trackingForm.shipping_provider}
                                            onChange={(e) => setTrackingForm(prev => ({ ...prev, shipping_provider: e.target.value }))}
                                            placeholder="e.g., DHL, FedEx, Standard Shipping"
                                            disabled={isUpdating}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Tracking Number
                                        </label>
                                        <Input
                                            type="text"
                                            value={trackingForm.tracking_number}
                                            onChange={(e) => setTrackingForm(prev => ({ ...prev, tracking_number: e.target.value }))}
                                            placeholder="Enter tracking number"
                                            disabled={isUpdating}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Status
                                        </label>
                                        <Select value={trackingForm.status} onValueChange={(value) => setTrackingForm(prev => ({ ...prev, status: value }))} disabled={isUpdating}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="placed">Placed</SelectItem>
                                                <SelectItem value="processing">Processing</SelectItem>
                                                <SelectItem value="confirmed">Confirmed</SelectItem>
                                                <SelectItem value="dispatched">Dispatched</SelectItem>
                                                <SelectItem value="delivered">Delivered</SelectItem>
                                                <SelectItem value="cancelled">Cancelled</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Estimated Delivery Date
                                        </label>
                                        <Input
                                            type="date"
                                            value={trackingForm.estimated_delivery_date}
                                            onChange={(e) => setTrackingForm(prev => ({ ...prev, estimated_delivery_date: e.target.value }))}
                                            disabled={isUpdating}
                                        />
                                    </div>

                                    <div className="flex space-x-3 pt-4">
                                        <Button
                                            onClick={handleUpdateTracking}
                                            disabled={isUpdating}
                                            className="flex-1"
                                        >
                                            {isUpdating ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    Updating...
                                                </>
                                            ) : (
                                                'Update Tracking'
                                            )}
                                        </Button>
                                        <Button
                                            onClick={() => setSelectedOrder(null)}
                                            variant="outline"
                                            disabled={isUpdating}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <Truck className="mx-auto text-muted-foreground mb-4" size={48} />
                                <h3 className="text-lg font-medium mb-2">Select an Order</h3>
                                <p className="text-muted-foreground">Choose an order from the list to update its tracking information.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}