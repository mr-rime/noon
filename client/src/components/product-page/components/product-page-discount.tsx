export function ProductPageDiscount() {
    return (
        <div aria-label="Product discount information" className="flex items-center space-x-1">
            <span aria-label="Discounted price" className="text-[#7e859b] text-[14px] line-through">
                <span className="text-[15px]">EGP</span> 78,550
            </span>
            <span aria-label="Discount percentage" className="text-[#298A08] font-bold text-[14px]">
                6% <span>Off</span>
            </span>
        </div>
    );
}
