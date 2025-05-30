import { ProdcutPrice } from "./components/prodcut-price";
import { ProductBadge } from "./components/product-badge";
import { ProductImage } from "./components/product-image";
import { ProductTitle } from "./components/product-title";


export function Product() {
    return (
        <>
            <article className="w-full max-w-[230px] h-[467px] group rounded-[12px] border border-[#DDDDDD] p-2">
                <ProductImage />
                <ProductTitle />
                <ProdcutPrice />
                <ProductBadge />
            </article>
        </>
    )
}