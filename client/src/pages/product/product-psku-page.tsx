import { useQuery } from '@apollo/client'
import { useParams } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { GET_PRODUCT } from '@/graphql/product'
import type { ProductSpecification, ProductType } from '@/types'
import { ProductReviews } from '../../components/product-reviews/product-reviews'
import { Separator } from '../../components/ui/separator'
import { ProductOverview } from './components/product-overview'
import { ProductOverviewTabs } from './components/product-overview-tabs'
import { ProductPageDetails } from './components/product-page-details'
import { ProductPageFulfilmentBadge } from './components/product-page-fulfilment-badge'
import { ProductPageImage } from './components/product-page-image'
import { ProdcutPagePrice } from './components/product-page-price'
import { ProductPageRates } from './components/product-page-rates'
import { ProductPageTitle } from './components/product-page-title'
import { Button } from '../../components/ui/button'
import { AddToWishlistButton } from './components/add-to-wishlist-button'
import { ProductPageLoadingSkeleton } from './components/product-page-loading-skeleton'
import { Badge } from '../../components/ui/badge'
import {
    Package,
    Tag,
    Star,
    Hash,
    Users,
    ChevronDown,
    ChevronUp,
    Info
} from 'lucide-react'

export function ProductPskuPage() {
    const { productId } = useParams({
        from: '/(main)/_homeLayout/$title/$productId/',
    })
    const [selectedGroupProduct, setSelectedGroupProduct] = useState<any>(null)
    const [showGroupProducts, setShowGroupProducts] = useState(false)

    const { data, loading } = useQuery<{
        getProduct: {
            success: boolean
            message: string
            product: ProductType
        }
    }>(GET_PRODUCT, { variables: { id: productId } })

    const product = data?.getProduct.product


    useEffect(() => {
        if (product) {
            setSelectedGroupProduct(product)
        }
    }, [product])

    if (loading) return <ProductPageLoadingSkeleton />

    if (!product) {
        return (
            <main className="site-container py-20">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-muted-foreground">Product not found</h1>
                    <p className="text-muted-foreground mt-2">The product you're looking for doesn't exist.</p>
                </div>
            </main>
        )
    }


    const groupProducts = (product as any).groupProducts || []
    const hasGroupVariants = groupProducts.length > 1
    const productImages = product.images ? [...product.images].sort(
        (a, b) => Number(b.is_primary ?? false) - Number(a.is_primary ?? false)
    ) : []


    const productAttributes = (product as any).productAttributes || []
    const groupAttributes = (product as any).groupAttributes || []

    return (
        <main aria-label="Product Page" className="!scroll-smooth mb-32 overflow-x-hidden bg-white">
            <section
                aria-labelledby="product-main-section"
                className="site-container relative flex w-full flex-col items-start justify-start space-y-10 px-5 pt-10 lg:flex-row lg:space-x-10 lg:space-y-0">


                <div className="fixed bottom-0 left-0 z-10 flex w-full items-center bg-white px-2 py-2 md:hidden">
                    <button className="flex h-[60px] w-[55px] flex-col items-center justify-center border border-[#f1f3f9] bg-white p-[3px] px-[10px] text-inherit">
                        <span className="text-[#8d94a7] text-[1rem]">Qty</span>
                        <span className="font-bold text-[1.5rem] text-inherit">1</span>
                    </button>
                    <Button className="h-[48px] w-full cursor-pointer rounded-[4px] bg-[#2B4CD7] font-bold text-[14px] text-white uppercase transition-colors hover:bg-[#6079E1]">
                        Add to cart
                    </Button>
                </div>


                <div className="mb-0 block md:hidden">
                    <ProductPageTitle className="block text-[18px] md:hidden" title={product.name} />
                    <div className="mt-6 mb-4 flex w-full items-center justify-between">
                        <ProductPageRates theme="mobile" />
                        <AddToWishlistButton />
                    </div>
                </div>
                <ProductPageImage images={productImages.map((image) => image.image_url) || ['']} />
                <div
                    className="flex w-full flex-col items-start justify-center lg:w-[calc(500/1200*100%)]"
                    aria-labelledby="product-info-section">


                    <ProductPageTitle className="hidden md:block" title={product.name} />
                    <div className="hidden md:block">
                        <ProductPageRates />
                    </div>


                    <div className="flex flex-wrap gap-2 mb-4">
                        {(product as any).psku && (
                            <Badge variant="secondary" className="text-xs font-mono">
                                <Hash className="h-3 w-3 mr-1" />
                                PSKU: {(product as any).psku}
                            </Badge>
                        )}
                        {(product as any).category_name && (
                            <Badge variant="secondary" className="text-xs">
                                <Tag className="h-3 w-3 mr-1" />
                                {(product as any).category_name}
                            </Badge>
                        )}
                        {(product as any).brand_name && (
                            <Badge variant="secondary" className="text-xs">
                                <Star className="h-3 w-3 mr-1" />
                                {(product as any).brand_name}
                            </Badge>
                        )}
                        {hasGroupVariants && (
                            <Badge variant="default" className="text-xs">
                                <Users className="h-3 w-3 mr-1" />
                                {groupProducts.length} Variants
                            </Badge>
                        )}
                    </div>


                    <ProdcutPagePrice
                        price={selectedGroupProduct?.price || product.price}
                        currency={product.currency}
                        discount_percentage={product.discount_percentage || 0}
                        final_price={selectedGroupProduct?.price || product.final_price || 0}
                    />


                    <ProductPageFulfilmentBadge />
                    <Separator className="my-5" />


                    <div className="flex flex-col items-start justify-center space-y-5 w-full">


                        {productAttributes.length > 0 && (
                            <div className="w-full">
                                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                    <Package className="h-5 w-5 text-primary" />
                                    Product Specifications
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {productAttributes.map((attr: any) => (
                                        <div key={attr.id} className="bg-muted/30 rounded-lg p-3">
                                            <div className="text-sm font-medium text-muted-foreground">{attr.attribute_name}</div>
                                            <div className="font-medium">{attr.attribute_value}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}


                        {hasGroupVariants && (
                            <div className="w-full">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-lg font-semibold flex items-center gap-2">
                                        <Users className="h-5 w-5 text-primary" />
                                        Available Variants ({groupProducts.length})
                                    </h3>
                                    <Button
                                        className="h-8 px-3 text-sm bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        onClick={() => setShowGroupProducts(!showGroupProducts)}
                                    >
                                        {showGroupProducts ? (
                                            <ChevronUp className="h-4 w-4" />
                                        ) : (
                                            <ChevronDown className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>

                                {showGroupProducts && (
                                    <div className="space-y-3">
                                        {groupProducts.map((groupProduct: any) => (
                                            <div
                                                key={groupProduct.id}
                                                className={`border rounded-lg p-4 cursor-pointer transition-colors ${selectedGroupProduct?.id === groupProduct.id
                                                    ? 'border-primary bg-primary/10'
                                                    : 'hover:border-primary/50'
                                                    }`}
                                                onClick={() => setSelectedGroupProduct(groupProduct)}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h4 className="font-medium">{groupProduct.name}</h4>
                                                        {groupProduct.psku && (
                                                            <p className="text-sm text-muted-foreground">PSKU: {groupProduct.psku}</p>
                                                        )}
                                                        <div className="flex items-center gap-2 mt-2">
                                                            <span className="font-bold text-primary">
                                                                {groupProduct.currency} {groupProduct.final_price || groupProduct.price}
                                                            </span>
                                                            {groupProduct.stock !== undefined && (
                                                                <Badge
                                                                    variant={groupProduct.stock > 10 ? "default" : groupProduct.stock > 0 ? "secondary" : "destructive"}
                                                                    className="text-xs"
                                                                >
                                                                    Stock: {groupProduct.stock}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {selectedGroupProduct?.id === groupProduct.id && (
                                                        <Badge variant="default">Selected</Badge>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}


                        {groupAttributes.length > 0 && (
                            <div className="w-full">
                                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                    <Info className="h-5 w-5 text-primary" />
                                    Available Options
                                </h3>
                                <div className="space-y-3">
                                    {groupAttributes.map((attr: any) => (
                                        <div key={attr.id} className="bg-muted/30 rounded-lg p-3">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-medium">{attr.attribute_name}</h4>
                                                {attr.is_required && (
                                                    <Badge variant="secondary" className="text-xs">Required</Badge>
                                                )}
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {attr.attribute_values?.map((value: string, i: number) => (
                                                    <Badge key={i} variant="secondary" className="text-xs">
                                                        {value}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}


                        <div className="w-full">
                            <div className="bg-muted/30 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-medium">Stock Status</h4>
                                        <p className="text-sm text-muted-foreground">
                                            {selectedGroupProduct?.stock || product.stock || 0} units available
                                        </p>
                                    </div>
                                    <Badge
                                        variant={
                                            (selectedGroupProduct?.stock || product.stock || 0) > 20
                                                ? "default"
                                                : (selectedGroupProduct?.stock || product.stock || 0) > 0
                                                    ? "secondary"
                                                    : "destructive"
                                        }
                                    >
                                        {(selectedGroupProduct?.stock || product.stock || 0) > 20
                                            ? "In Stock"
                                            : (selectedGroupProduct?.stock || product.stock || 0) > 0
                                                ? "Low Stock"
                                                : "Out of Stock"}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="flex w-full flex-col items-start justify-center md:hidden">
                    <div className="w-full">
                        <ProductPageDetails product={product as ProductType} theme="mobile" />
                    </div>
                </div>


                <div className="max-md:hidden">
                    <ProductPageDetails product={product as ProductType} />
                </div>
            </section>


            <section id="product_overview">
                <Separator className="mt-16 mb-5 h-[9px] bg-[#F3F4F8]" />
                <ProductOverviewTabs />
            </section>


            <section className="site-container mt-10">
                <ProductOverview
                    overview={product.product_overview as string}
                    specs={product.productSpecifications as ProductSpecification[]}
                />
            </section>


            <Separator className="mt-20 mb-5 h-[9px] bg-[#F3F4F8]" />
            <ProductReviews productId={productId} />
        </main>
    )
}
