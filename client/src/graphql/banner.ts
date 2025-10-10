import { gql } from '@apollo/client'

export const GET_BANNERS = gql`
  query GetBanners($placement: String, $isActive: Boolean, $limit: Int, $offset: Int, $search: String) {
    getBanners(placement: $placement, isActive: $isActive, limit: $limit, offset: $offset, search: $search) {
      banners {
        id
        name
        placement
        description
        target_url
        image_url
        start_date
        end_date
        is_active
        created_at
      }
      total
    }
  }
`

export const GET_BANNER = gql`
  query GetBanner($id: String!) {
    getBanner(id: $id) {
      id
      name
      placement
      description
      target_url
      image_url
      start_date
      end_date
      is_active
      created_at
    }
  }
`

export const CREATE_BANNER = gql`
  mutation CreateBanner(
    $name: String!
    $placement: String!
    $description: String
    $targetUrl: String
    $imageUrl: String
    $startDate: String!
    $endDate: String!
    $isActive: Boolean
  ) {
    createBanner(
      name: $name
      placement: $placement
      description: $description
      targetUrl: $targetUrl
      imageUrl: $imageUrl
      startDate: $startDate
      endDate: $endDate
      isActive: $isActive
    ) {
      success
      message
      banner {
        id
        name
        placement
        description
        target_url
        image_url
        start_date
        end_date
        is_active
      }
    }
  }
`

export const UPDATE_BANNER = gql`
  mutation UpdateBanner(
    $id: String!
    $name: String!
    $placement: String!
    $description: String
    $targetUrl: String
    $imageUrl: String
    $startDate: String!
    $endDate: String!
    $isActive: Boolean
  ) {
    updateBanner(
      id: $id
      name: $name
      placement: $placement
      description: $description
      targetUrl: $targetUrl
      imageUrl: $imageUrl
      startDate: $startDate
      endDate: $endDate
      isActive: $isActive
    ) {
      success
      message
      banner {
        id
        name
        placement
        description
        target_url
        image_url
        start_date
        end_date
        is_active
      }
    }
  }
`

export const DELETE_BANNER = gql`
  mutation DeleteBanner($id: String!) {
    deleteBanner(id: $id) {
      success
      message
    }
  }
`

export const TOGGLE_BANNER_STATUS = gql`
  mutation ToggleBannerStatus($id: String!) {
    toggleBannerStatus(id: $id) {
      success
      message
      banner {
        id
        name
        is_active
      }
    }
  }
`
