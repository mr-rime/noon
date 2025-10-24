import { gql } from '@apollo/client'

export const UPLOADTHING_UPLOAD = gql`
    mutation($files: [FileInput!]!) {
        batchUploadImages(files: $files) {
            success
            message
            images {
                image_url
                is_primary
                key
            }
            errors
        }
    }
`
