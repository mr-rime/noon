import { Heart, Trash2, Truck } from "lucide-react";
import { useMutation } from "@apollo/client";
import { REMOVE_CART_ITEM } from "@/graphql/cart";
import { cn } from "@/utils/cn";
import type { CartItem } from "../types";
import { Link } from "@tanstack/react-router";
import { Select } from "@/components/ui/select";

export function CartItem({
	product_id,
	name,
	images,
	price,
	currency,
	final_price,
	discount_percentage,
	stock,
	refetchCartItems,
}: CartItem & { refetchCartItems: () => Promise<any> }) {
	const [removeCartItem, { loading }] = useMutation(REMOVE_CART_ITEM);

	const qtys = Array.from({ length: Number(stock) }).map((_, quantity) => ({
		value: String(quantity + 1),
		label: String(quantity + 1),
	}));

	const handleChange = (value: string) => {
		console.log("Selected:", value);
	};

	return (
		<div className={cn("flex items-start w-full h-fit bg-white p-[15px] rounded-[6px]", loading && "opacity-50")}>
			<Link to="/$title/$productId" params={{ productId: product_id, title: name }} className="w-fit h-[200px] mr-2">
				<img src={images?.[0].image_url} alt="product-img" loading="lazy" className="w-fit h-full" />
			</Link>

			<div className="mr-16 mt-2">
				<div className="">
					<h2 className="text-[14px] leading-[16px] font-semibold truncate w-[400px] whitespace-break-spaces">
						{name}
					</h2>
				</div>
				<div className="mt-3 h-[70px]">
					<span className="text-[#7c87a8] text-[12px]">Order in 14 h 45 m</span>
					<div className="font-bold text-[12px]">
						Get it by <span className="text-[#38ae04] font-bold ">Sat, Jun 14</span>
					</div>
					<div className="mt-2 text-[14px]">
						<span className="text-[#7e859b]">Sold by</span> <strong>iQ</strong>
					</div>
				</div>

				<div className="mt-5 flex items-center space-x-2 h-[30px]">
					<button
						onClick={async () => {
							await removeCartItem({ variables: { product_id } });
							await refetchCartItems();
						}}
						className="flex items-center space-x-1 cursor-pointer border border-[#dadce3] rounded-[8px] p-[8px]"
					>
						<Trash2 size={18} color="#7e859b" />
						<span className="text-[12px] text-[#7e859b]">Remove</span>
					</button>
					<button className="flex items-center space-x-1 cursor-pointer border border-[#dadce3] rounded-[8px] p-[8px]">
						<Heart size={18} color="#7e859b" />
						<span className="text-[12px] text-[#7e859b]">Move to Wishlist</span>
					</button>
				</div>
			</div>

			<div className="flex flex-col items-center w-[150px]">
				<div className="flex flex-col items-center h-[50px]">
					<div className="text-black flex items-center space-x-1 ">
						<span className="text-[14px]">{currency}</span>
						<b className="text-[22px]">{final_price}</b>
					</div>
					<div className="space-x-1 text-[11px] w-full text-end">
						<span className="line-through  text-[#7e859b]">{price}</span>
						<span className="uppercase text-[#38ae04] font-bold">{discount_percentage}% Off</span>
					</div>
				</div>
				<div className="flex flex-col items-end mt-3 h-[50px]">
					{/* <div className=" w-[70px] h-[70px] ">
                        <img src="/media/svgs/marketplace-v2-en.svg" alt="marketplace-badge" className="w-full h-full" />
                    </div> */}
					<div className="flex items-center space-x-2">
						<Truck color="#376FE0" size={20} />
						<span className="text-[12px] font-medium">Free Delivery</span>
					</div>
				</div>

				<div className=" flex items-center space-x-4">
					<span className="text-[#7e859b] text-[14px] ">Qty</span>
					<Select options={qtys} defaultValue="1" onChange={handleChange} className="w-[60px] rounded-[8px] p-[8px]" />
				</div>
			</div>
		</div>
	);
}
