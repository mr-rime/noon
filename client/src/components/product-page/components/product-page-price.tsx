import { ProductPageDiscount } from "./product-page-discount";

export function ProdcutPagePrice() {
    return (
        <div className="flex items-center space-x-1 mt-10">
            <span className="text-[16px] text-[#101010] font-semibold">EGP</span>
            <div className="flex items-center space-x-1">
                <strong className="text-[24px] text-[#1d2939]">72555.00</strong>
                <ProductPageDiscount />
            </div>
        </div>
    )
}
