import { gql } from "@apollo/client";

export const GET_USERS =
    gql`
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
