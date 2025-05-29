import { ProductDiscount } from "./product-discount";

export function ProdcutPrice() {
    return (
        <div className="flex items-center space-x-1 mt-1">
            <span className="text-[12px] text-[#101010] font-normal">EGP</span>
            <div className="flex items-center space-x-1">
                <strong className="text-[18px]">70,128</strong>
                <ProductDiscount />
            </div>
        </div>
    )
}
