import { gql } from '@apollo/client'

export const LOGIN = gql`
    mutation ($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            success
            message
            user {
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

export const REGISTER = gql`
    mutation ($first_name: String!, $last_name: String, $email: String!, $password: String!) {
        register(first_name: $first_name, last_name: $last_name, email: $email, password: $password) {
            success
            message
            user {
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

export const LOGOUT = gql`
    mutation {
        logout {
            success
            message
        }
    }
`
