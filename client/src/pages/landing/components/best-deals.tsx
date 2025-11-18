import { Carousel } from '@/components/ui/carousel'
import { ProductsListSkeleton } from '@/components/ui/products-list-skeleton'
import type { ProductType } from '@/types'
import { Product } from '@/components/product/product'

type BestDealsProps = {
    products: ProductType[]
    loading: boolean
}

export default function BestDeals({ products = [], loading }: BestDealsProps) {
    const deals = (products || []).slice(0, 20)

    if (!loading && deals.length === 0) return null

    return (
        <div className="min-h-[467px] bg-white mt-10">
            <h3 className="my-2 select-none text-center font-extrabold text-[36px] uppercase">
                <span className="text-black">Best</span> <span className="text-[#E4041B]">deals for you</span>
            </h3>
            <div className="flex min-h-[200px] w-full items-center bg-white p-4">
                <div className="w-full">
                    {loading && deals.length === 0 ? (
                        <ProductsListSkeleton />
                    ) : deals.length === 0 && !loading ? (
                        <div className="p-6 text-center text-sm text-muted-foreground">No deals available right now.</div>
                    ) : (
                        <Carousel
                            className="w-full"
                            controlClassName="flex items-center justify-center bg-white cursor-pointer w-[30px] h-[30px] shadow-[0_0_3px_-1px_rgba(0,0,0,.5)] border border-[#ccc]  "
                        >
                            {deals.map((product) => (
                                <Product key={product.id} {...product} />
                            ))}
                        </Carousel>
                    )}
                </div>
            </div>
        </div>
    )
}
