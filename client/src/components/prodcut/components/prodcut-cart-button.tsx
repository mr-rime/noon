import { product_icons } from "../constants/icons";

export function ProductCartButton() {
	return (
		<button className="w-[36px] h-[36px] bg-white hover:bg-white/90 transition-colors shadow-md rounded-[6px] flex items-center justify-center cursor-pointer">
			{product_icons.addCartIcon}
		</button>
	);
}
