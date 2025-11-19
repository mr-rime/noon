import { useNavigate, useParams } from '@tanstack/react-router'
import { ArrowLeft, Download, Printer } from 'lucide-react'
import { useQuery } from '@apollo/client'
import { GET_ORDER_DETAILS } from '@/graphql/orders'
import { toast } from 'sonner'

export function OrderInvoicePage() {
    const navigate = useNavigate()
    const { invoiceId } = useParams({ strict: false }) as { invoiceId: string }

    const { data, loading, error } = useQuery(GET_ORDER_DETAILS, {
        variables: {
            order_id: invoiceId
        },
        skip: !invoiceId
    })

    if (loading) {
        return (
            <section className="h-screen w-full max-w-4xl mx-auto px-4">
                <div className="h-[400px] w-full animate-pulse rounded bg-gray-100" />
            </section>
        )
    }

    if (error) {
        toast.error('Failed to load invoice')
        return (
            <section className="h-screen w-full max-w-4xl mx-auto px-4">
                <p className="text-red-500">Failed to load invoice. Please try again.</p>
            </section>
        )
    }

    const order = data?.getOrderDetails?.order

    if (!order) {
        return (
            <section className="h-screen w-full max-w-4xl mx-auto px-4">
                <p className="text-gray-500">Invoice not found</p>
            </section>
        )
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const handlePrint = () => {
        window.print()
    }

    const handleDownload = () => {

        const invoiceText = `
INVOICE
Order ID: ${order.id}
Date: ${formatDate(order.created_at)}
Total: ${order.currency} ${order.total_amount.toFixed(2)}

Items:
${order.items.map((item: any) => `- ${item.product_name} (Qty: ${item.quantity}) - ${item.currency} ${item.price.toFixed(2)}`).join('\n')}
    `

        const blob = new Blob([invoiceText], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `invoice-${order.id}.txt`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    return (
        <section className="h-screen w-full max-w-4xl mx-auto px-4 py-8">

            <div className="flex items-center justify-between mb-8">
                <button
                    onClick={() => navigate({ to: '/orders' })}
                    className="flex cursor-pointer items-center space-x-1 text-[#374151] text-[14px] hover:underline">
                    <ArrowLeft size={18} color="#374151" />
                    <span>Back to orders</span>
                </button>

                <div className="flex items-center space-x-4">
                    <button
                        onClick={handleDownload}
                        className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                    >
                        <Download size={16} />
                        <span>Download</span>
                    </button>
                    <button
                        onClick={handlePrint}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                        <Printer size={16} />
                        <span>Print</span>
                    </button>
                </div>
            </div>


            <div className="bg-white rounded-lg shadow-lg p-8">

                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Invoice</h1>
                        <p className="text-gray-600 mt-2">Order #{order.id}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-gray-600">Date: {formatDate(order.created_at)}</p>
                        <p className="text-gray-600">Status: <span className="capitalize font-medium">{order.status}</span></p>
                        <p className="text-gray-600">Payment: <span className="capitalize font-medium">{order.payment_status}</span></p>
                    </div>
                </div>


                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Order Items</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-3 px-4">Product</th>
                                    <th className="text-center py-3 px-4">Quantity</th>
                                    <th className="text-right py-3 px-4">Price</th>
                                    <th className="text-right py-3 px-4">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.items.map((item: any, index: number) => (
                                    <tr key={item.id || index} className="border-b">
                                        <td className="py-3 px-4">
                                            <div>
                                                <p className="font-medium">{item.product_name}</p>
                                                <p className="text-sm text-gray-600">{item.product_description}</p>
                                            </div>
                                        </td>
                                        <td className="text-center py-3 px-4">{item.quantity}</td>
                                        <td className="text-right py-3 px-4">{item.currency} {item.price.toFixed(2)}</td>
                                        <td className="text-right py-3 px-4">{item.currency} {(item.price * item.quantity).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>


                <div className="flex justify-end mb-8">
                    <div className="w-64">
                        <div className="flex justify-between py-2">
                            <span>Subtotal:</span>
                            <span>{order.currency} {order.total_amount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span>Shipping:</span>
                            <span className="text-green-600">FREE</span>
                        </div>
                        <div className="border-t pt-2 flex justify-between font-bold text-lg">
                            <span>Total:</span>
                            <span>{order.currency} {order.total_amount.toFixed(2)}</span>
                        </div>
                    </div>
                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Shipping Address</h3>
                        <div className="text-gray-600">
                            {order.shipping_address ? (
                                <pre className="whitespace-pre-wrap">{order.shipping_address}</pre>
                            ) : (
                                <p>Address collected during checkout</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4">Payment Information</h3>
                        <div className="text-gray-600">
                            <p>Method: {order.payment_method}</p>
                            <p>Status: <span className="capitalize">{order.payment_status}</span></p>
                        </div>
                    </div>
                </div>


                {order.tracking && (
                    <div className="mt-8 pt-8 border-t">
                        <h3 className="text-lg font-semibold mb-4">Tracking Information</h3>
                        <div className="text-gray-600">
                            <p>Provider: {order.tracking.shipping_provider}</p>
                            <p>Tracking Number: {order.tracking.tracking_number}</p>
                            {order.tracking.estimated_delivery_date && (
                                <p>Estimated Delivery: {formatDate(order.tracking.estimated_delivery_date)}</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </section>
    )
}
