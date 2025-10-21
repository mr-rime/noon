import { gql } from '@apollo/client'

export const GET_PRODUCT_REVIEWS = gql`
  query GetProductReviews($productId: String!, $limit: Int, $offset: Int) {
    getProductReviews(productId: $productId, limit: $limit, offset: $offset) {
      success
      message
      reviews {
        id
        product_id
        user_id
        rating
        comment
        verified_purchase
        created_at
        updated_at
        user {
          id
          first_name
          last_name
        }
        helpful_votes_count
        user_has_voted
      }
      total
      average_rating
    }
  }
`

export const GET_USER_REVIEW = gql`
  query GetUserReview($productId: String!, $orderId: String) {
    getUserReview(productId: $productId, orderId: $orderId) {
      success
      message
      review {
        id
        product_id
        user_id
        rating
        comment
        verified_purchase
        created_at
        updated_at
        user {
          id
          first_name
          last_name
        }
      }
    }
  }
`

export const CREATE_PRODUCT_REVIEW = gql`
  mutation CreateProductReview(
    $product_id: String!
    $rating: Int!
    $comment: String
    $verified_purchase: Boolean!
    $order_id: String
  ) {
    createProductReview(
      product_id: $product_id
      rating: $rating
      comment: $comment
      verified_purchase: $verified_purchase
      order_id: $order_id
    ) {
      success
      message
      review {
        id
        product_id
        user_id
        rating
        comment
        verified_purchase
        created_at
        updated_at
        user {
          id
          first_name
          last_name
        }
      }
    }
  }
`

export const UPDATE_PRODUCT_REVIEW = gql`
  mutation UpdateProductReview(
    $id: Int!
    $rating: Int!
    $comment: String
  ) {
    updateProductReview(
      id: $id
      rating: $rating
      comment: $comment
    ) {
      success
      message
      review {
        id
        product_id
        user_id
        rating
        comment
        verified_purchase
        created_at
        updated_at
        user {
          id
          first_name
          last_name
        }
      }
    }
  }
`

export const DELETE_PRODUCT_REVIEW = gql`
  mutation DeleteProductReview($id: Int!) {
    deleteProductReview(id: $id) {
      success
      message
    }
  }
`

export const VOTE_REVIEW_HELPFUL = gql`
  mutation VoteReviewHelpful($reviewId: Int!) {
    voteReviewHelpful(reviewId: $reviewId) {
      success
      message
      hasVoted
      votesCount
    }
  }
`

export const REMOVE_REVIEW_VOTE = gql`
  mutation RemoveReviewVote($reviewId: Int!) {
    removeReviewVote(reviewId: $reviewId) {
      success
      message
      hasVoted
      votesCount
    }
  }
`
