import { Product } from "@/components/prodcut"
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

    console.log(data?.getProducts.products)

    return (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 p-4">
            {
                data?.getProducts.products.map((product) => <Product key={product.id} {...product} />)
            }
        </div>
    )
}
