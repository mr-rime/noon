import { gql } from "@apollo/client";


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

export const LOGOUT = gql`
    mutation {
        logout {
            success
            message
        }
    }
`