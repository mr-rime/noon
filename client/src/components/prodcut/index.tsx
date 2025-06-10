import { Link } from "@tanstack/react-router";
import { ProdcutPrice } from "./components/prodcut-price";
import { ProductBadge } from "./components/product-badge";
import { ProductImage } from "./components/product-image";
import { ProductTitle } from "./components/product-title";


export function Product() {
    return (
        <article className="w-full max-w-[230px] h-[467px] rounded-[12px] border border-[#DDDDDD] p-2 overflow-x-hidden bg-white">
            <Link to="/p/$productId" params={{ productId: "1" }} className="w-full h-full">
                <ProductImage />
                <ProductTitle />
                <ProdcutPrice />
                <ProductBadge />
            </Link>
        </article>
    )
}