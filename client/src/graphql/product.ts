import { gql } from "@apollo/client";

export const CREATE_PRODUCT = gql`
    mutation(
            $name: String!
            $price: Float!
            $currency: String!
            $product_overview: String
            $category_id: String
            $discount: DiscountInput
            $is_returnable: Boolean!
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
            is_returnable: $is_returnable
            discount: $discount
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
                    is_returnable
                    created_at
                images {
                    id
                    image_url
                    is_primary
                }
                productOptions {
                    id
                    name
                    link
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
`;

export const UPDATE_PRODUCT = gql`
    mutation (
        $id: String!
        $name: String
        $price: Float
        $currency: String
        $product_overview: String
        $category_id: String
        $discount: DiscountInput
        $is_returnable: Boolean
        $images: [ProductImageInput]
        $productOptions: [ProductOptionInput]
        $productSpecifications: [ProductSpecificationInput]
    ) {
        updateProduct(
            id: $id
            name: $name
            price: $price
            currency: $currency
            product_overview: $product_overview
            category_id: $category_id
            images: $images
            is_returnable: $is_returnable
            discount: $discount
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
            is_returnable
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
    `;

export const GET_PRODUCTS = gql`
        query($limit:Int, $offset:Int,$search:String){
            getProducts(limit:$limit,offset:$offset, search: $search) {
                success
                message
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
                    productOptions {
                        id
                        name
                        value
                        linked_product_id
                        image_url
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

`;

export const GET_PRODUCT = gql`

query ($id: ID!) {
    getProduct(id: $id) {
        product {
        id
        name
        price
        currency
        is_returnable
        final_price
        discount_percentage
        discount {
            id
            product_id
            type
            value
            starts_at
            ends_at
        }
        product_overview
        images {
            id
            image_url
        }
        productSpecifications {
            id
            spec_name
            spec_value
        }

        productOptions {
            id
            linked_product_id
            image_url
            name
            value
            type
        }
        }
    }
    }
`;
