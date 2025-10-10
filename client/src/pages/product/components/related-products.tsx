import { useQuery } from '@apollo/client'
import { Product } from '@/components/product/product'
import { Carousel } from '@/components/ui/carousel'
import { ProductsListSkeleton } from '@/components/ui/products-list-skeleton'
import { GET_RELATED_PRODUCTS } from '@/graphql/related-products'
import type { ProductType } from '@/types'

interface RelatedProductsProps {
    productId: string
    limit?: number
}

export function RelatedProducts({ productId, limit = 8 }: RelatedProductsProps) {

    const { data, loading, error } = useQuery<{
        getRelatedProducts: {
            success: boolean
            message: string
            products: ProductType[]
        }
    }>(GET_RELATED_PRODUCTS, {
        variables: { productId, limit },
        skip: !productId
    })


    const getDisplayProducts = () => {
        const relatedProducts = data?.getRelatedProducts?.products || []


        return relatedProducts.slice(0, limit)
    }

    if (loading) {
        return (
            <section className="site-container mt-16 mb-8">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">You Might Also Like</h2>
                    <p className="text-gray-600 mt-2">Loading related products...</p>
                </div>
                <ProductsListSkeleton />
            </section>
        )
    }

    const displayProducts = getDisplayProducts()

    if (error || !displayProducts.length) {
        return null
    }

    return (
        <section className="site-container mt-16 mb-8">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">You Might Also Like</h2>
                <p className="text-gray-600 mt-2">Discover more products in this category</p>
            </div>

            <div className="flex min-h-[200px] w-full items-center bg-white p-4">
                <div className="w-full">
                    <Carousel
                        className="w-full"
                        controlClassName="flex items-center justify-center bg-white cursor-pointer w-[30px] h-[30px] shadow-[0_0_3px_-1px_rgba(0,0,0,.5)] border border-[#ccc]"
                    >
                        {displayProducts.map((product) => (
                            <Product key={product.id} {...product} />
                        ))}
                    </Carousel>
                </div>
            </div>
        </section>
    )
}
