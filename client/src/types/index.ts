
export * from './ui'
export * from './category'
export * from './auth'

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

export type GetUserResponse = {
  getUser: {
    success: boolean
    message: string
    user: User
  }
}

export type ProductSpecification = {
  id?: string
  product_id?: ProductType['id']
  spec_name: string
  spec_value: string
}

export type ProductImage = {
  id?: string
  image_url: string
  is_primary: boolean
  key?: string // UploadThing file key for deletion
}

export type ProductVariant = {
  id?: string
  product_id?: string
  sku: string
  price?: number
  stock?: number
  image_url?: string
  option_combination?: string | any[]
  options?: Array<{ name: string; value: string }>
  created_at?: string
  updated_at?: string
}

export type ProductAttribute = {
  id?: string
  product_id?: string
  attribute_name: string
  attribute_value: string
  created_at?: string
  updated_at?: string
}

export type GroupAttribute = {
  id?: string
  group_id?: string
  attribute_name: string
  attribute_values: string[]
  is_required: boolean
  display_order: number
  created_at?: string
  updated_at?: string
}

export type Category = {
  category_id: string
  parent_id?: string
  name: string
  slug: string
  description?: string
  level?: number
  path?: string
  display_order?: number
  image_url?: string
  icon_url?: string
  is_active: boolean
  created_at?: string
  updated_at?: string
  children?: Category[]
  subcategories?: Subcategory[]
}

export type Subcategory = {
  subcategory_id: string
  category_id: string
  name: string
  slug: string
  description?: string
  is_active: boolean
  created_at?: string
  updated_at?: string
}

export type Brand = {
  brand_id: number
  name: string
  slug: string
  description?: string
  logo_url?: string
  is_active: boolean
  created_at?: string
  updated_at?: string
}

export type ProductGroup = {
  group_id: string
  name: string
  description?: string
  category_id?: string
  subcategory_id?: string
  brand_id?: number
  attributes?: string
  created_at?: string
  updated_at?: string
}


export type ProductType = {
  productOptions: any
  id: string
  psku?: string
  name: string
  price: number
  final_price: number
  currency: string
  stock: number
  is_returnable: boolean
  is_public: boolean
  product_overview?: string
  user_id?: number
  store_id?: number
  category_id?: string
  subcategory_id?: string
  brand_id?: number
  group_id?: string
  category_name?: string
  subcategory_name?: string
  brand_name?: string
  group_name?: string
  rating?: number
  review_count?: number
  discount?: DiscountType | null
  discount_percentage?: number
  is_in_wishlist?: boolean
  wishlist_id?: string
  images: ProductImage[]
  productSpecifications: ProductSpecification[]
  productAttributes?: ProductAttribute[]
  groupAttributes?: GroupAttribute[]
  groupProducts?: ProductType[]
  variants?: ProductVariant[]
  created_at?: string
  updated_at?: string
}

export type DiscountType = {
  id?: string
  prodcut_id?: string
  type: 'percentage' | 'fixed'
  value: number
  starts_at: Date
  ends_at: Date
}
