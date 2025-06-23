import { gql } from "@apollo/client";


export const CREATE_PRODUCT = gql`
    mutation(
            $name: String!
            $price: Float!
            $currency: String!
            $product_overview: String
            $category_id: String
            $images: [ProductImageInput]
            $productOptions: [ProductOptionInput]
            $productSpecifications: [ProductSpecificationInput]
    ) {
        createProduct(
            name: $name
            price: $price
            currency: $currency
            product_overview: $product_overview
            category_id: $category_id
            images: $images
            productOptions: $productOptions
            productSpecifications: $productSpecifications
        ) {
            success
            message
            product {
                    id
                    name
                    price
                    currency
                    product_overview
                    category_id
                    created_at
                images {
                    id
                    image_url
                    is_primary
                }
                productOptions {
                    id
                    name
                    value
                    type
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
