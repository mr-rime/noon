export type User = {
	id: number;
	hash: string;
	email: string;
	first_name: string;
	last_name: string;
	birthday: string;
	phone_number: string;
	created_at?: Date;
	updated_at?: Date;
};

export type ProductOption = {
	id?: string;
	product_id?: ProductType["id"];
	name: string;
	value: string;
	image_url: string;
	link?: string;
	type: "link" | "text";
};

export type ProductSpecification = {
	id?: string;
	product_id?: ProductType["id"];
	spec_name: string;
	spec_value: string;
};

export type ProductImage = {
	id?: string;
	image_url: string;
	is_primary: boolean;
};

export type ProductType = {
	id: string;
	name: string;
	price: number;
	currency: string;
	product_overview: string;
	category_id: string;
	is_returnable: boolean;
	discount_percentage?: number;
	final_price?: number;
	stock: number;
	discount?: DiscountType | null;
	images: ProductImage[];
	productOptions: ProductOption[];
	productSpecifications: ProductSpecification[];
};

export type DiscountType = {
	id: string;
	prodcut_id: string;
	type: "percentage" | "fixed";
	value: number;
	starts_at: Date;
	ends_at: Date;
};
