import { useQuery } from '@apollo/client'
import { Carousel } from '@/components/ui/carousel'
import { ProductsListSkeleton } from '@/components/ui/products-list-skeleton'
import type { ProductType } from '@/types'
import { Product } from '@/components/product/product'
import { GET_HOME } from '@/graphql/home'

export default function DiscountedProducts() {
    const { data, loading } = useQuery<{ getHome: { home: { discountedProducts: ProductType[] } } }>(GET_HOME, {
        variables: { limit: 12, offset: 0, search: '' },
        fetchPolicy: 'cache-and-network'
    })
    const discounted = (data?.getHome.home?.discountedProducts || []) as ProductType[]

    return (
        <div className="flex min-h-[200px] w-full items-center bg-white p-4">
            <div className="w-full">
                {loading ? (
                    <ProductsListSkeleton />
                ) : discounted.length === 0 ? (
                    <div className="p-6 text-center text-sm text-muted-foreground">No discounted products right now.</div>
                ) : (
                    <Carousel
                        className="w-full"
                        controlClassName="flex items-center justify-center bg-white cursor-pointer w-[30px] h-[30px] shadow-[0_0_3px_-1px_rgba(0,0,0,.5)] border border-[#ccc]  ">
                        {discounted.map((product) => (
                            <Product key={product.id} {...product} />
                        ))}
                    </Carousel>
                )}
            </div>
        </div>
    )
}


