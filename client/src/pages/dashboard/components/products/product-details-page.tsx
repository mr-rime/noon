import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { useParams } from '@tanstack/react-router'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { ArrowLeft, Package, Users } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { GET_PRODUCT } from '@/graphql/product'
import { ProductDetailsForm } from './product-details-form'
import { ProductGroupManager } from './product-group-manager'
import type { ProductType } from '@/types'

export function ProductDetailsPage() {
    const { productId } = useParams({ from: '/(dashboard)/d/_dashboardLayout/products/$productId/' })
    const [product, setProduct] = useState<ProductType | null>(null)

    const { loading, error, refetch } = useQuery(GET_PRODUCT, {
        variables: { id: productId },
        onCompleted: (data) => {
            if (data?.getProduct?.product) {
                setProduct(data.getProduct.product)
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
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link to="/d/products">
                        <Button variant="ghost" className="h-8 px-3 text-sm bg-gray-100 text-gray-700 hover:bg-gray-200">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Products
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">{product.name}</h1>
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

                {/* Quick Stats */}
                <div className="flex items-center gap-4">
                    <div className="border rounded-lg p-3">
                        <div className="flex items-center gap-2">
                            <div className="text-2xl font-bold">
                                ${product.final_price || product.price}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                {product.currency}
                            </div>
                        </div>
                    </div>

                    <div className="border rounded-lg p-3">
                        <div className="flex items-center gap-2">
                            <div className="text-2xl font-bold">{product.stock}</div>
                            <div className="text-sm text-muted-foreground">in stock</div>
                        </div>
                    </div>

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

            {/* Main Content */}
            <div className="flex gap-6">
                {/* Left Sidebar - Product Group Manager */}
                <ProductGroupManager
                    product={product}
                    onProductUpdate={handleProductUpdate}
                    onGroupUpdate={handleGroupUpdate}
                />

                {/* Main Content - Product Details Form */}
                <div className="flex-1">
                    <ProductDetailsForm
                        product={product}
                        onUpdate={handleProductUpdate}
                    />
                </div>
            </div>

            {/* Group Products Section */}
            {product.group_id && product.groupProducts && product.groupProducts.length > 0 && (
                <div className="border rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Package className="h-5 w-5" />
                        <h3 className="text-lg font-semibold">Related Products in Group</h3>
                        <Badge variant="secondary">{product.groupProducts.length} products</Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {product.groupProducts.map((groupProduct: any) => (
                            <div key={groupProduct.id} className="border rounded-lg p-4">
                                <div className="space-y-2">
                                    <div className="flex items-start justify-between">
                                        <h4 className="font-medium text-sm">{groupProduct.name}</h4>
                                        <Badge variant="secondary" className="text-xs">
                                            {groupProduct.psku}
                                        </Badge>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="text-sm font-medium">
                                            ${groupProduct.final_price || groupProduct.price}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            Stock: {groupProduct.stock}
                                        </div>
                                    </div>

                                    {groupProduct.productAttributes && groupProduct.productAttributes.length > 0 && (
                                        <div className="flex flex-wrap gap-1">
                                            {groupProduct.productAttributes.map((attr: any) => (
                                                <Badge key={attr.id} variant="secondary" className="text-xs">
                                                    {attr.attribute_name}: {attr.attribute_value}
                                                </Badge>
                                            ))}
                                        </div>
                                    )}

                                    <div className="pt-2">
                                        <Link to={`/d/products/$productId`} params={{ productId: groupProduct.id }}>
                                            <Button className="w-full h-8 px-3 text-sm bg-gray-100 text-gray-700 hover:bg-gray-200">
                                                View Details
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}