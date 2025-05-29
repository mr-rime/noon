import { product_icons } from "../constants/icons";

export function ProductWishlistButton() {
    return (
        <button className="w-[28px] h-[28px] bg-white hover:bg-white/50 transition-colors shadow-md rounded-[6px] flex items-center justify-center cursor-pointer">
            {product_icons.wishlist2}
        </button>
    )
}
