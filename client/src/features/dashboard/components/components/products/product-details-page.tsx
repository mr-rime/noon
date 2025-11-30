import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { useParams } from '@tanstack/react-router'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { ArrowLeft, Package, Users } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { GET_DASHBOARD_PRODUCT } from '@/features/product/api/product'
import { ProductDetailsForm } from './product-details-form'
import type { ProductType } from '@/shared/types'
import { ProductGroupManager } from './product-group-manager'

export function ProductDetailsPage() {
    const { productId } = useParams({ from: '/(dashboard)/d/_dashboardLayout/products/$productId/' })
    const [product, setProduct] = useState<ProductType | null>(null)

    const { loading, error, refetch } = useQuery(GET_DASHBOARD_PRODUCT, {
        variables: { id: productId },
        onCompleted: (data) => {
            if (data?.getDashboardProduct?.product) {
                setProduct(data.getDashboardProduct.product)
            }
        }
    })

    const handleProductUpdate = (updatedProduct: ProductType) => {
        setProduct(updatedProduct)
        refetch()
    }

    const handleGroupUpdate = () => {
        refetch()
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2 text-muted-foreground">Loading product details...</p>
                </div>
            </div>
        )
    }

    if (error || !product) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-destructive mb-2">Product Not Found</h2>
                <p className="text-muted-foreground mb-4">The product you're looking for doesn't exist or has been deleted.</p>
                <Link to="/d/products">
                    <Button variant="outline">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Products
                    </Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="space-y-6">

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link to="/d/products">
                        <Button variant="ghost" className="h-8 px-3 text-sm bg-gray-100 text-gray-700 hover:bg-gray-200">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Products
                        </Button>
                    </Link>
                    <div>
                        <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="font-mono">PSKU: {product.psku}</Badge>
                            {product.group_id && (
                                <Badge variant="secondary" className="flex items-center gap-1">
                                    <Package className="h-3 w-3" />
                                    Group: {product.group_name || product.group_id}
                                </Badge>
                            )}
                            {product.category_name && (
                                <Badge variant="secondary">{product.category_name}</Badge>
                            )}
                            {product.brand_name && (
                                <Badge variant="secondary">{product.brand_name}</Badge>
                            )}
                        </div>
                    </div>
                </div>


                <div className="flex items-center gap-4">
                    {product.group_id && (
                        <div className="border rounded-lg p-3">
                            <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <div className="text-sm text-muted-foreground">
                                    Group Products
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>


            <div className="flex gap-6">

                <ProductGroupManager
                    product={product}
                    onProductUpdate={handleProductUpdate}
                    onGroupUpdate={handleGroupUpdate}
                />


                <div className="flex-1">
                    <ProductDetailsForm
                        product={product}
                        onUpdate={handleProductUpdate}
                    />
                </div>
            </div>
        </div>
    )
}

export default ProductDetailsPage