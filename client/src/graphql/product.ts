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
`;

export const GET_PRODUCTS = gql`
        query($limit:Int, $offset:Int){
            getProducts(limit:$limit,offset:$offset) {
                success
                message
                products {
                    id
                    name
                    price
                    currency
                    product_overview
                    images {
                        id
                        image_url
                        is_primary
                    }
                    productOptions {
                        id
                        name
                        value
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
            image_url
            name
            value
            type
        }
        }
    }
    }
`;
