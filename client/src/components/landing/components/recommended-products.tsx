import { Product } from "@/components/prodcut"
import { Carousel } from "@/components/ui/carousel"
import { GET_PRODUCTS } from "@/graphql/product"
import type { ProductType } from "@/types"
import { useQuery } from "@apollo/client"


export function RecommendedProducts() {
    const { data } = useQuery<{
        getProducts: {
            success: boolean,
            message: string,
            products: ProductType[]
        }
    }>(GET_PRODUCTS, { variables: { limit: 10, offset: 0 } })

    return (
        <div className="bg-white w-full flex flex-col items-center p-4">
            <h3 className="uppercase font-extrabold text-[50px] mb-7 text-center">
                <span className="text-black">Recommended</span> <span className="text-[#E4041B]">for you</span>
            </h3>

            <div className="w-full">
                <Carousel className="w-full" controlClassName="flex items-center justify-center bg-white cursor-pointer w-[30px] h-[30px] shadow-[0_0_3px_-1px_rgba(0,0,0,.5)] border border-[#ccc]  ">
                    {
                        data?.getProducts.products.map((product) => <Product key={product.id} {...product} />)
                    }
                </Carousel>
            </div>
        </div>
    )
}
