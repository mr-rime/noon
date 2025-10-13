import { gql } from '@apollo/client'

export const GET_CATEGORIES = gql`
  query GetCategories($search: String) {
    getCategories(search: $search) {
      success
      message
      categories {
        category_id
        name
        slug
        description
        is_active
        subcategories {
          subcategory_id
          name
          slug
          description
        }
      }
    }
  }
`

export const GET_SUBCATEGORIES = gql`
  query GetSubcategories($category_id: String, $search: String) {
    getSubcategories(category_id: $category_id, search: $search) {
      success
      message
      subcategories {
        subcategory_id
        category_id
        name
        slug
        description
        is_active
      }
    }
  }
`

export const GET_BRANDS = gql`
  query GetBrands($search: String) {
    getBrands(search: $search) {
      success
      message
      brands {
        brand_id
        name
        slug
        description
        logo_url
        is_active
      }
    }
  }
`

export const GET_PRODUCT_GROUPS = gql`
  query GetProductGroups($category_id: String) {
    getProductGroups(category_id: $category_id) {
      success
      message
      groups {
        group_id
        name
        description
        category_id
        subcategory_id
        brand_id
        attributes
        created_at
        updated_at
      }
    }
  }
`

export const CREATE_PSKU_PRODUCT = gql`
  mutation CreatePskuProduct(
    $name: String!
    $price: Float!
    $currency: String!
    $psku: String
    $category_id: String
    $subcategory_id: String
    $brand_id: Int
    $group_id: String
    $stock: Int
    $is_returnable: Boolean
    $product_overview: String
    $images: [ProductImageInput]
    $productSpecifications: [ProductSpecificationInput]
    $productAttributes: [ProductAttributeInput]
  ) {
    createProduct(
      name: $name
      price: $price
      currency: $currency
      psku: $psku
      category_id: $category_id
      subcategory_id: $subcategory_id
      brand_id: $brand_id
      group_id: $group_id
      stock: $stock
      is_returnable: $is_returnable
      product_overview: $product_overview
      images: $images
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

export const GET_PRODUCT_BY_PSKU = gql`
  query GetProductByPsku($psku: String!) {
    getProductByPsku(psku: $psku) {
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

export const CREATE_PRODUCT_GROUP = gql`
  mutation CreateProductGroup($input: ProductGroupInput!) {
    createProductGroup(input: $input) {
      success
      message
      group {
        group_id
        name
        description
        category_id
        subcategory_id
        brand_id
        attributes
        created_at
        updated_at
      }
    }
  }
`

export const ADD_PRODUCT_TO_GROUP = gql`
  mutation AddProductToGroup($product_id: String!, $group_id: String!) {
    addProductToGroup(product_id: $product_id, group_id: $group_id) {
      success
      message
      product {
        id
        psku
        name
        group_id
        group_name
      }
    }
  }
`

export const REMOVE_PRODUCT_FROM_GROUP = gql`
  mutation RemoveProductFromGroup($product_id: String!) {
    updateProduct(id: $product_id, group_id: null) {
      success
      message
      product {
        id
        psku
        name
        group_id
        group_name
      }
    }
  }
`

export const CREATE_CATEGORY = gql`
  mutation CreateCategory($input: CategoryInput!) {
    createCategory(input: $input) {
      success
      message
      category {
        category_id
        name
        slug
        description
        is_active
      }
    }
  }
`

export const CREATE_SUBCATEGORY = gql`
  mutation CreateSubcategory($input: SubcategoryInput!) {
    createSubcategory(input: $input) {
      success
      message
      subcategory {
        subcategory_id
        category_id
        name
        slug
        description
        is_active
      }
    }
  }
`

export const CREATE_BRAND = gql`
  mutation CreateBrand($input: BrandInput!) {
    createBrand(input: $input) {
      success
      message
      category {
        brand_id
        name
        slug
        description
        logo_url
        is_active
      }
    }
  }
`

export const UPDATE_PRODUCT_GROUP = gql`
  mutation UpdateProductGroup(
    $groupId: String!
    $name: String
    $description: String
    $attributes: [String]
  ) {
    updateProductGroup(
      groupId: $groupId
      name: $name
      description: $description
      attributes: $attributes
    ) {
      success
      message
      group {
        group_id
        name
        description
        category_id
        subcategory_id
        brand_id
        attributes
        created_at
        updated_at
      }
    }
  }
`

export const DELETE_PRODUCT_GROUP = gql`
  mutation DeleteProductGroup($groupId: String!) {
    deleteProductGroup(groupId: $groupId) {
      success
      message
    }
  }
`

export const CHECK_PSKU_EXISTS = gql`
  query CheckPskuExists($psku: String!) {
    getProductByPsku(psku: $psku) {
      success
      message
      product {
        id
        psku
        name
      }
    }
  }
`
export const VALIDATE_PSKU = gql`
  query ValidatePsku($psku: String!) {
    validatePsku(psku: $psku)
  }
`
