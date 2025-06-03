

export type ProductType = {
    id: string
    user_id: string
    category_id: string
    name: string
    price: number
    currency: string
    product_overview: string
    created_at: Date
    updated_at: Date
}

export type ProductImagesType = {
    id: number
    product_id: ProductType['id']
    image_url: string
    is_primary: boolean
}

export type ProductOptionsType = {
    id: number
    product_id: ProductType['id']
    name: string
    value: string
}

export type ProductSpecificationsType = {
    id: number
    product_id: ProductType['id']
    spec_name: string
    spec_value: string
}