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

export const DELETE_IMAGES = gql`
    mutation($fileKeys: [String!], $imageIds: [Int!]) {
        deleteImages(fileKeys: $fileKeys, imageIds: $imageIds) {
            success
            message
            deletedCount
            dbDeletedCount
        }
    }
`