import { Carousel } from '@/components/ui/carousel'
import { ProductsListSkeleton } from '@/components/ui/products-list-skeleton'
import type { ProductType } from '@/types'
import { Product } from '@/components/product/product'

type DiscountedProductsProps = {
    products: ProductType[]
    loading: boolean
}

export default function DiscountedProducts({ products = [], loading }: DiscountedProductsProps) {
    const items = (products || []).slice(0, 20)

    if (!loading && items.length === 0) return null

    return (
        <div className="min-h-[467px] bg-white mt-10">
            <h3 className="my-2 select-none text-center font-extrabold text-[36px] uppercase">
                <span className="text-black">Products</span> <span className="text-[#E4041B]">on discount</span>
            </h3>
            <div className="flex min-h-[200px] w-full items-center bg-white p-4">
                <div className="w-full">
                    {loading && items.length === 0 ? (
                        <ProductsListSkeleton />
                    ) : items.length === 0 && !loading ? (
                        <div className="p-6 text-center text-sm text-muted-foreground">No discounted products right now.</div>
                    ) : (
                        <Carousel
                            className="w-full"
                            controlClassName="flex items-center justify-center bg-white cursor-pointer w-[30px] h-[30px] shadow-[0_0_3px_-1px_rgba(0,0,0,.5)] border border-[#ccc]  "
                            itemsPerView="auto"
                            gap={16}
                            showControls={true}
                            loop={false}
                        >
                            {items.map((product) => (
                                <Product key={product.id} {...product} imageHeight={290} />
                            ))}
                        </Carousel>
                    )}
                </div>
            </div>
        </div>
    )
}
