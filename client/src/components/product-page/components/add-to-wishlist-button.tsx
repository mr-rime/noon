import { Heart } from "lucide-react";

export function AddToWishlistButton() {
	return (
		<button className="w-[32px] h-[32px] p-1 rounded-[6px] bg-[#f3f4f8] flex items-center justify-center">
			<Heart size={19} className="text-[#3866DF] fill-[#3866DF]" />
		</button>
	);
}
