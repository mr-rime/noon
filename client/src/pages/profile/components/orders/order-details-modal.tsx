import { X } from 'lucide-react'
import { ItemSummary } from '../tracking-details/components/item-summary'
import { OrderInvoice } from '../tracking-details/components/order-invoice'
import { OrderTimeline } from '../tracking-details/components/order-timeline'
import { Button } from '@/components/ui/button'
import { useQuery } from '@apollo/client'
import { GET_ORDER_DETAILS } from '@/graphql/orders'
import { toast } from 'sonner'

interface OrderDetailsModalProps {
    order: any
    isOpen: boolean
    onClose: () => void
}

export function OrderDetailsModal({ order, isOpen, onClose }: OrderDetailsModalProps) {
    const { data, loading, error } = useQuery(GET_ORDER_DETAILS, {
        variables: {
            order_id: order?.id
        },
        skip: !isOpen || !order?.id
    })

    if (!isOpen || !order) return null

    if (loading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="relative w-full max-w-7xl max-h-[90vh] bg-white rounded-lg shadow-xl overflow-hidden">
                    <div className="flex items-center justify-between p-6 border-b">
                        <div>
                            <h2 className="text-2xl font-bold">Loading Order Details...</h2>
                        </div>
                        <Button
                            onClick={onClose}
                            className="h-8 w-8 p-0"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="h-96 animate-pulse bg-gray-100 rounded" />
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        toast.error('Failed to load order details')
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="relative w-full max-w-7xl max-h-[90vh] bg-white rounded-lg shadow-xl overflow-hidden">
                    <div className="flex items-center justify-between p-6 border-b">
                        <div>
                            <h2 className="text-2xl font-bold">Error Loading Order Details</h2>
                        </div>
                        <Button
                            onClick={onClose}
                            className="h-8 w-8 p-0"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="flex items-center justify-center h-96">
                            <p className="text-red-500">Failed to load order details. Please try again.</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const orderDetails = data?.getOrderDetails?.order || order

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="relative w-full max-w-7xl h-[90vh] bg-white rounded-lg shadow-xl overflow-hidden flex flex-col">
                <div className="flex items-center justify-between p-6 border-b">
                    <div>
                        <h2 className="text-2xl font-bold">Order Details</h2>
                        <p className="text-gray-600">Order #{orderDetails.id}</p>
                    </div>
                    <Button
                        onClick={onClose}
                        className="h-8 w-8 p-0"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <div className="flex-1 overflow-y-auto">
                    <div className="p-6">
                        <div className="flex gap-6">
                            <div className="flex-1">
                                {orderDetails.status === 'cancelled' ? (
                                    <div className="h-fit w-full bg-white p-[16px] rounded-lg border mb-6">
                                        <div className="flex items-center space-x-3 mb-4">
                                            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                                                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                                                    <line x1="15" y1="9" x2="9" y2="15" strokeWidth="2" />
                                                    <line x1="9" y1="9" x2="15" y2="15" strokeWidth="2" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900">Cancelled on {new Date(orderDetails.updated_at).toLocaleDateString('en-US', {
                                                    weekday: 'long',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    hour12: true
                                                })}</h3>
                                                {orderDetails.cancellation_reason && (
                                                    <p className="text-sm text-gray-600">Reason: {orderDetails.cancellation_reason}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mb-6">
                                        <OrderTimeline order={orderDetails} tracking={orderDetails.tracking} />
                                    </div>
                                )}
                                <div className="mb-6">
                                    <ItemSummary order={orderDetails} />
                                </div>
                            </div>

                            <div className="w-80">
                                <OrderInvoice order={orderDetails} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
