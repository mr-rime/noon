import { X } from 'lucide-react'
import { OrderInvoice } from '../../profile/components/tracking-details/components/order-invoice'
import { OrderTimeline } from '../../profile/components/tracking-details/components/order-timeline'
import { Button } from '../components/ui/button'
import { useQuery } from '@apollo/client'
import { GET_ORDER_DETAILS } from '@/graphql/orders'
import { toast } from 'sonner'

interface AdminOrderDetailsModalProps {
    order: any
    isOpen: boolean
    onClose: () => void
}

export function AdminOrderDetailsModal({ order, isOpen, onClose }: AdminOrderDetailsModalProps) {
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
                            variant="ghost"
                            size="sm"
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
                            variant="ghost"
                            size="sm"
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
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold">Order Details - Admin View</h2>
                        <p className="text-gray-600">Order #{orderDetails.id}</p>
                        <p className="text-sm text-gray-500">Customer ID: {orderDetails.user_id}</p>

                        {/* Shipping Address - Prominently Displayed */}
                        {orderDetails.shipping_address && (
                            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Shipping Address
                                </h3>
                                <div className="text-sm text-blue-800">
                                    {(() => {
                                        try {
                                            // Try to parse as JSON first
                                            const addressData = typeof orderDetails.shipping_address === 'string'
                                                ? JSON.parse(orderDetails.shipping_address)
                                                : orderDetails.shipping_address;

                                            // Format the address nicely
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
                                                const countryNames: Record<string, string> = {
                                                    'EG': 'Egypt',
                                                    'US': 'United States',
                                                    'GB': 'United Kingdom',
                                                    'CA': 'Canada',
                                                    'AU': 'Australia',
                                                    'FR': 'France',
                                                    'DE': 'Germany',
                                                    'IT': 'Italy',
                                                    'ES': 'Spain',
                                                    'NL': 'Netherlands',
                                                    'BE': 'Belgium',
                                                    'CH': 'Switzerland',
                                                    'AT': 'Austria',
                                                    'SE': 'Sweden',
                                                    'NO': 'Norway',
                                                    'DK': 'Denmark',
                                                    'FI': 'Finland',
                                                    'PL': 'Poland',
                                                    'CZ': 'Czech Republic',
                                                    'HU': 'Hungary',
                                                    'RO': 'Romania',
                                                    'BG': 'Bulgaria',
                                                    'GR': 'Greece',
                                                    'PT': 'Portugal',
                                                    'IE': 'Ireland',
                                                    'LU': 'Luxembourg',
                                                    'MT': 'Malta',
                                                    'CY': 'Cyprus',
                                                    'EE': 'Estonia',
                                                    'LV': 'Latvia',
                                                    'LT': 'Lithuania',
                                                    'SK': 'Slovakia',
                                                    'SI': 'Slovenia',
                                                    'HR': 'Croatia',
                                                    'JP': 'Japan',
                                                    'KR': 'South Korea',
                                                    'CN': 'China',
                                                    'IN': 'India',
                                                    'BR': 'Brazil',
                                                    'MX': 'Mexico',
                                                    'AR': 'Argentina',
                                                    'CL': 'Chile',
                                                    'CO': 'Colombia',
                                                    'PE': 'Peru',
                                                    'VE': 'Venezuela',
                                                    'ZA': 'South Africa',
                                                    'NG': 'Nigeria',
                                                    'KE': 'Kenya',
                                                    'MA': 'Morocco',
                                                    'TN': 'Tunisia',
                                                    'DZ': 'Algeria',
                                                    'LY': 'Libya',
                                                    'SD': 'Sudan',
                                                    'ET': 'Ethiopia',
                                                    'GH': 'Ghana',
                                                    'UG': 'Uganda',
                                                    'TZ': 'Tanzania',
                                                    'RW': 'Rwanda',
                                                    'BW': 'Botswana',
                                                    'ZM': 'Zambia',
                                                    'ZW': 'Zimbabwe',
                                                    'MW': 'Malawi',
                                                    'MZ': 'Mozambique',
                                                    'MG': 'Madagascar',
                                                    'MU': 'Mauritius',
                                                    'SC': 'Seychelles',
                                                    'RE': 'Réunion',
                                                    'YT': 'Mayotte',
                                                    'KM': 'Comoros',
                                                    'DJ': 'Djibouti',
                                                    'SO': 'Somalia',
                                                    'ER': 'Eritrea',
                                                    'SS': 'South Sudan',
                                                    'CF': 'Central African Republic',
                                                    'TD': 'Chad',
                                                    'NE': 'Niger',
                                                    'ML': 'Mali',
                                                    'BF': 'Burkina Faso',
                                                    'CI': 'Côte d\'Ivoire',
                                                    'GN': 'Guinea',
                                                    'LR': 'Liberia',
                                                    'SL': 'Sierra Leone',
                                                    'GM': 'Gambia',
                                                    'SN': 'Senegal',
                                                    'GW': 'Guinea-Bissau',
                                                    'CV': 'Cape Verde',
                                                    'ST': 'São Tomé and Príncipe',
                                                    'GQ': 'Equatorial Guinea',
                                                    'GA': 'Gabon',
                                                    'CG': 'Republic of the Congo',
                                                    'CD': 'Democratic Republic of the Congo',
                                                    'AO': 'Angola',
                                                    'CM': 'Cameroon',
                                                    'BI': 'Burundi'
                                                };
                                                addressLines.push(countryNames[addressData.country] || addressData.country);
                                            }

                                            return addressLines.map((line, index) => (
                                                <div key={index} className={index === 0 ? 'font-semibold' : ''}>
                                                    {line}
                                                </div>
                                            ));
                                        } catch {
                                            // If parsing fails, display as plain text
                                            return <div className="whitespace-pre-line">{orderDetails.shipping_address}</div>;
                                        }
                                    })()}
                                </div>
                            </div>
                        )}
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="h-8 w-8 p-0"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                    <div className="p-6">
                        <div className="flex gap-6">
                            {/* Main Content */}
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
                            </div>

                            {/* Sidebar */}
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
