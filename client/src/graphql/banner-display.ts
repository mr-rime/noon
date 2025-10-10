import { gql } from '@apollo/client'

export const GET_ACTIVE_BANNERS_BY_PLACEMENT = gql`
  query GetActiveBannersByPlacement($placement: String!) {
    getActiveBannersByPlacement(placement: $placement) {
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

export const GET_ALL_ACTIVE_BANNERS = gql`
  query GetAllActiveBanners {
    getBanners(isActive: true, limit: 50) {
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
