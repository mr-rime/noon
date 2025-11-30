import { onError } from '@apollo/client/link/error'
import { GraphQLError } from 'graphql'
import { toast } from 'sonner'
import { handleGraphQLError, logError } from '@/shared/utils/error-handler'

export const errorLink = onError(({ graphQLErrors, networkError }) => {

    if (graphQLErrors) {
        graphQLErrors.forEach(({ message, locations, path, extensions }) => {
            const errorMessage = handleGraphQLError({
                message,
                locations,
                path,
                extensions,
            } as GraphQLError)

            logError({ message, locations, path, extensions }, 'GraphQL')


            if (extensions?.code !== 'UNAUTHENTICATED') {
                toast.error(errorMessage)
            }

            console.error(
                `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
            )
        })
    }


    if (networkError) {
        logError(networkError, 'Network')


        let errorMessage = 'An error occurred. Please try again.'

        if ('statusCode' in networkError) {
            const statusCode = networkError.statusCode
            if (statusCode === 401) {
                errorMessage = 'Please log in to continue'
            } else if (statusCode === 403) {
                errorMessage = 'You do not have permission to perform this action'
            } else if (statusCode === 404) {
                errorMessage = 'Resource not found'
            } else if (statusCode >= 500) {
                errorMessage = 'Server error. Please try again later'
            }
        }

        if ('message' in networkError) {
            if (networkError.message.includes('Network request failed')) {
                errorMessage = 'Unable to connect to server. Please check your internet connection'
            } else if (networkError.message.includes('timeout')) {
                errorMessage = 'Request timed out. Please try again'
            }
        }


        if (!('statusCode' in networkError) || networkError.statusCode !== 401) {
            toast.error(errorMessage)
        }

        console.error(`[Network error]: ${networkError}`)
    }
})


export async function handleMutationError(error: unknown): Promise<void> {
    const logErrorDetails = (error: unknown) => {
        logError(error, 'Mutation')
    }

    if (error instanceof Error) {
        logErrorDetails(error)

        if (error.message.includes('GraphQL')) {
            return
        }


        let message = error.message

        if (message.includes('Network error')) {
            message = 'Unable to connect to server'
        } else if (message.includes('timeout')) {
            message = 'Request timed out'
        }

        toast.error(message)
        return
    }

    logErrorDetails(error)
    toast.error('An error occurred. Please try again.')
}
