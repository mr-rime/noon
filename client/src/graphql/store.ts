import { gql } from '@apollo/client'

export const LOGIN_STORE = gql`
  mutation LoginStore($email: String!, $password: String!) {
    loginStore(email: $email, password: $password) {
      success
      message
      store {
        id
        name
        email
        number
        thumbnail_url
        created_at
        updated_at
      }
    }
  }
`

export const REGISTER_STORE = gql`
  mutation RegisterStore($name: String!, $email: String!, $password: String!, $number: String, $thumbnail_url: String) {
    registerStore(name: $name, email: $email, password: $password, number: $number, thumbnail_url: $thumbnail_url) {
      success
      message
      store {
        id
        name
        email
        number
        thumbnail_url
        created_at
        updated_at
      }
    }
  }
`

export const LOGOUT_STORE = gql`
  mutation LogoutStore {
    logoutStore {
      success
      message
      store {
        id
        name
        email
      }
    }
  }
`
