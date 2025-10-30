import { gql } from '@apollo/client'

export const GET_USERS = gql`
        query {
            users {
                success
                message
                users {
                    id
                    hash
                    first_name
                    last_name
                    email
                    birthday
                }
        }
        }
    `

export const GET_USER = gql`
        query($hash:String!) {
            getUser(hash: $hash) {
                success
                message
                user {
                    id
                    hash
                    email
                    phone_number
                    first_name
                    last_name
                    birthday
                }
            }
        }
    `

export const UPDATE_USER = gql`
  mutation UpdateUser($id: Int!, $first_name: String, $last_name: String, $phone_number: String, $birthday: String) {
    updateUser(id: $id, first_name: $first_name, last_name: $last_name, phone_number: $phone_number, birthday: $birthday) {
      success
      message
      user {
        id
        hash
        first_name
        last_name
        email
        birthday
        phone_number
      }
    }
  }
`;
