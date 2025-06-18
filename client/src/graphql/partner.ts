import { gql } from "@apollo/client";


export const CREATE_PARTNER = gql`
    mutation ($business_email: String!, $store_name: String!, $business_phone: String, $password: String!) {
    createPartner(
        business_email: $business_email
        store_name: $store_name
        business_phone: $business_phone
        password: $password
    ) {
        success
        message
        partner {
            id
            store_name
            business_email
            status
        }
    }
    }
`

export const LOGIN_PARTNER = gql`
    mutation ($business_email: String!, $password: String!) {
        loginPartner(business_email: $business_email, password: $password) {
            success
            message
            partner {
                user_id
                store_name
            }
        }
    }
`

export const GET_PARTNER = gql`
query ($id: String!) {
    getPartner(id: $id) {
        success
        message
        partner {
            id
            user_id
            store_name
            status
            created_at
            updated_at
        }
    }
    }

`