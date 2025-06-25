import { create } from "zustand";
import type { ProductImage, ProductOption, ProductSpecification, ProductType } from "@/types";

type ProductStore = {
	product: ProductType;
	setProduct: (data: Partial<ProductType>) => void;
	addImage: (img: ProductImage) => void;
	addOption: (option: ProductOption) => void;
	addSpecification: (spec: ProductSpecification) => void;
	reset: () => void;
};

const defaultProduct: ProductType = {
	id: "",
	name: "",
	price: 0,
	stock: 0,
	currency: "USD",
	product_overview: "",
	category_id: "",
	images: [],
	productOptions: [],
	productSpecifications: [],
};

export const useProductStore = create<ProductStore>((set) => ({
	product: defaultProduct,

	setProduct: (data) =>
		set((state) => ({
			product: {
				...state.product,
				...data,
			},
		})),

	addImage: (img) =>
		set((state) => ({
			product: {
				...state.product,
				images: [...state.product.images, img],
			},
		})),

	addOption: (option) =>
		set((state) => ({
			product: {
				...state.product,
				productOptions: [...state.product.productOptions, option],
			},
		})),

	addSpecification: (spec) =>
		set((state) => ({
			product: {
				...state.product,
				productSpecifications: [...state.product.productSpecifications, spec],
			},
		})),

	reset: () => set({ product: defaultProduct }),
}));
