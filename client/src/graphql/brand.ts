import { gql } from '@apollo/client'

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
        created_at
        updated_at
      }
    }
  }
`

export const CREATE_BRAND = gql`
  mutation CreateBrand($input: BrandInput!) {
    createBrand(input: $input) {
      success
      message
      brand {
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

export const UPDATE_BRAND = gql`
  mutation UpdateBrand($id: Int!, $input: BrandInput!) {
    updateBrand(id: $id, input: $input) {
      success
      message
      brand {
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

export const DELETE_BRAND = gql`
  mutation DeleteBrand($id: Int!) {
    deleteBrand(id: $id) {
      success
      message
    }
  }
`
