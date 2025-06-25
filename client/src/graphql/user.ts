import { gql } from "@apollo/client";

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
    `;

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
    `;
