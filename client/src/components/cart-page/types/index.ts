import type { ProductType } from "@/types";

export type CartItem = ProductType & { product_id: string };

export type CartResponseType = {
	getCartItems: {
		cartItems: CartItem[];
		message: string;
		success: boolean;
	};
};
