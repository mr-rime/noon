import { gql } from '@apollo/client'

export const CREATE_PRODUCT = gql`
    mutation(
            $name: String!
            $price: Float!
            $currency: String!
            $product_overview: String
            $category_id: Int
            $subcategory_id: Int
            $brand_id: Int
            $group_id: String
            $stock: Int
            $discount: DiscountInput
            $is_returnable: Boolean!
            $images: [ProductImageInput]
            $productSpecifications: [ProductSpecificationInput]
            $productAttributes: [ProductAttributeInput]
    ) {
        createProduct(
            name: $name
            price: $price
            currency: $currency
            product_overview: $product_overview
            category_id: $category_id
            subcategory_id: $subcategory_id
            brand_id: $brand_id
            group_id: $group_id
            stock: $stock
            images: $images
            is_returnable: $is_returnable
            discount: $discount
            productSpecifications: $productSpecifications
            productAttributes: $productAttributes
        ) {
            success
            message
            product {
                    id
                    psku
                    name
                    price
                    final_price
                    currency
                    stock
                    product_overview
                    category_id
                    subcategory_id
                    brand_id
                    group_id
                    category_name
                    subcategory_name
                    brand_name
                    group_name
                    is_returnable
                    created_at
                    updated_at
                images {
                    id
                    image_url
                    is_primary
                }
                productSpecifications {
                    id
                    spec_name
                    spec_value
                }
                productAttributes {
                    id
                    attribute_name
                    attribute_value
                }
                groupAttributes {
                    id
                    attribute_name
                    attribute_values
                    is_required
                    display_order
                }
                groupProducts {
                    id
                    psku
                    name
                    price
                    final_price
                    currency
                    stock
                    images {
                        id
                        image_url
                        is_primary
                    }
                    productAttributes {
                        id
                        attribute_name
                        attribute_value
                    }
                }
        }
        }
    }
`

export const UPDATE_PRODUCT = gql`
    mutation (
        $id: String!
        $name: String
        $price: Float
        $currency: String
        $product_overview: String
        $stock: Int
        $discount: DiscountInput
        $is_returnable: Boolean
        $images: [ProductImageInput]
        $productSpecifications: [ProductSpecificationInput]
        $productAttributes: [ProductAttributeInput]
    ) {
        updateProduct(
            id: $id
            name: $name
            price: $price
            currency: $currency
            product_overview: $product_overview
            stock: $stock
            images: $images
            is_returnable: $is_returnable
            discount: $discount
            productSpecifications: $productSpecifications
            productAttributes: $productAttributes
        ) {
        success
        message
        product {
            id
            psku
            name
            price
            final_price
            currency
            stock
            product_overview
            category_id
            subcategory_id
            brand_id
            group_id
            category_name
            subcategory_name
            brand_name
            group_name
            is_returnable
            created_at
            updated_at
            images {
                id
                image_url
                is_primary
            }
            productSpecifications {
                id
                spec_name
                spec_value
            }
            productAttributes {
                id
                attribute_name
                attribute_value
            }
            groupAttributes {
                id
                attribute_name
                attribute_values
                is_required
                display_order
            }
            groupProducts {
                id
                psku
                name
                price
                final_price
                currency
                stock
                images {
                    id
                    image_url
                    is_primary
                }
                productAttributes {
                    id
                    attribute_name
                    attribute_value
                }
            }
        }
        }
    }
    `

export const GET_PRODUCTS = gql`
        query($limit:Int, $offset:Int,$search:String){
            getProducts(limit:$limit,offset:$offset, search: $search) {
                success
                message
                total
                products {
                    id
                    name
                    price
                    currency
                    product_overview
                    is_returnable
                    final_price
                    stock
                    category_id
                    discount_percentage
                    created_at
                    discount {
                        id
                        product_id
                        type
                        value
                        starts_at
                        ends_at
                    }
                    images {
                        id
                        image_url
                        is_primary
                    }
                    productSpecifications {
                        id
                        spec_name
                        spec_value
                    }
                }
            }
    }

`


export const GET_PRODUCT = gql`
query ($id: ID!) {
    getProduct(id: $id) {
        product {
        id
        psku
        name
        price
        final_price
        currency
        stock
        is_returnable
        product_overview
        category_id
        subcategory_id
        brand_id
        group_id
        category_name
        subcategory_name
        brand_name
        group_name
        created_at
        updated_at
        discount_percentage
        discount {
            id
            product_id
            type
            value
            starts_at
            ends_at
        }
        images {
            id
            image_url
            is_primary
        }
        productSpecifications {
            id
            spec_name
            spec_value
        }
        productAttributes {
            id
            attribute_name
            attribute_value
        }
        groupAttributes {
            id
            attribute_name
            attribute_values
            is_required
            display_order
        }
        groupProducts {
            id
            psku
            name
            price
            final_price
            currency
            stock
            images {
                id
                image_url
                is_primary
            }
            productAttributes {
                id
                attribute_name
                attribute_value
            }
        }
        }
    }
    }
`

export const GET_PRODUCT_VARIANTS = gql`
    query GetProductVariants($productId: ID!) {
        getProduct(id: $productId) {
            product {
                id
                psku
                name
                price
                final_price
                stock
                currency
                images {
                    id
                    image_url
                    is_primary
                }
                productAttributes {
                    id
                    attribute_name
                    attribute_value
                }
                groupAttributes {
                    id
                    attribute_name
                    attribute_values
                    is_required
                    display_order
                }
                groupProducts {
                    id
                    psku
                    name
                    price
                    final_price
                    currency
                    stock
                    images {
                        id
                        image_url
                        is_primary
                    }
                    productAttributes {
                        id
                        attribute_name
                        attribute_value
                    }
                }
            }
        }
    }
`

export const DELETE_PRODUCT = gql`
    mutation DeleteProduct($id: String!) {
        deleteProduct(id: $id) {
            success
            message
        }
    }
`

export const GET_PRODUCT_BY_SKU = gql`
    query GetProductBySku($sku: String!) {
        getProductBySku(sku: $sku) {
            success
            message
            product {
                id
                psku
                name
                price
                final_price
                currency
                stock
                is_returnable
                product_overview
                category_id
                subcategory_id
                brand_id
                group_id
                category_name
                subcategory_name
                brand_name
                group_name
                created_at
                updated_at
                discount_percentage
                images {
                    id
                    image_url
                    is_primary
                }
                productAttributes {
                    id
                    attribute_name
                    attribute_value
                }
                groupAttributes {
                    id
                    attribute_name
                    attribute_values
                    is_required
                    display_order
                }
                groupProducts {
                    id
                    psku
                    name
                    price
                    final_price
                    currency
                    stock
                    images {
                        id
                        image_url
                        is_primary
                    }
                    productAttributes {
                        id
                        attribute_name
                        attribute_value
                    }
                }
            }
        }
    }
`

