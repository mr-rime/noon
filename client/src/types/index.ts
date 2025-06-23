

export type User = {
    id: number
    hash: string
    email: string
    first_name: string
    last_name: string
    birthday: string
    phone_number: string
    created_at?: Date
    updated_at?: Date
}

export type ProductOption = {
    name: string;
    value: string;
    type: 'text' | 'image';
};

export type ProductSpecification = {
    spec_name: string;
    spec_value: string;
};

export type ProductImage = {
    image_url: string;
    is_primary: boolean;
};

export type ProductType = {
    name: string;
    price: number;
    currency: string;
    product_overview: string;
    category_id: string;
    stock: number;
    images: ProductImage[];
    productOptions: ProductOption[];
    productSpecifications: ProductSpecification[];
};