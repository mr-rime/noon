export function ProductDiscount() {
    return (
        <div aria-label="Product discount information" className="flex items-center space-x-1">
            <span aria-label="Discounted price" className="text-[#7e859b] text-[12px] line-through">
                78,550
            </span>
            <span aria-label="Discount percentage" className="text-[#38ae04] font-bold text-[13px]">
                5%
            </span>
        </div>
    );
}
