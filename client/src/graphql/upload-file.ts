import { gql } from "@apollo/client";

export const UPLOAD_FILE = gql`
    mutation($file: Upload!) {
        uploadImage(file: $file) {
            success
            url
            message
        }
    }

`;
