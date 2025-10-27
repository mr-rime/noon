import { toast } from 'sonner'
import { GraphQLError } from 'graphql'

export interface AppError {
    message: string
    code?: string
    statusCode?: number
    details?: any
}


export function normalizeError(error: unknown): AppError {
    if (error instanceof Error) {
        return {
            message: error.message,
            code: error.name,
            details: { stack: error.stack },
        }
    }

    if (error && typeof error === 'object') {
        const err = error as any
        return {
            message: err.message || 'An error occurred',
            code: err.code,
            statusCode: err.statusCode,
            details: err,
        }
    }

    return {
        message: String(error) || 'An unknown error occurred',
    }
}


export function handleGraphQLError(error: GraphQLError): string {
    const { message, extensions } = error


    if (extensions?.code === 'UNAUTHENTICATED') {
        return 'Please log in to continue'
    }

    if (extensions?.code === 'FORBIDDEN') {
        return 'You do not have permission to perform this action'
    }

    if (extensions?.code === 'BAD_USER_INPUT') {
        return message || 'Invalid input provided'
    }

    if (extensions?.code === 'INTERNAL_SERVER_ERROR') {
        return 'A server error occurred. Please try again later'
    }


    return message || 'An error occurred'
}


export function showErrorToast(error: unknown, fallbackMessage = 'An error occurred') {
    const normalizedError = normalizeError(error)
    let message = normalizedError.message


    if (message.includes('Network error') || message.includes('fetch')) {
        message = 'Unable to connect to server. Please check your internet connection'
    }

    if (message.includes('timeout')) {
        message = 'Request timed out. Please try again'
    }

    toast.error(message || fallbackMessage, {
        duration: 5000,
        action: {
            label: 'Dismiss',
            onClick: () => console.log('Error dismissed'),
        },
    })
}


export function logError(error: unknown, context?: string) {
    const normalizedError = normalizeError(error)

    console.error(
        context ? `[${context}]` : '',
        'Error:',
        normalizedError.message,
        {
            code: normalizedError.code,
            statusCode: normalizedError.statusCode,
            details: normalizedError.details,
        }
    )



}


export function isRetryable(error: unknown): boolean {
    const normalizedError = normalizeError(error)


    if (normalizedError.message.includes('Network error') ||
        normalizedError.message.includes('fetch')) {
        return true
    }


    if (normalizedError.statusCode && normalizedError.statusCode >= 500) {
        return true
    }


    if (normalizedError.message.includes('timeout')) {
        return true
    }

    return false
}


export async function retryWithBackoff<T>(
    fn: () => Promise<T>,
    maxRetries = 3,
    initialDelay = 1000
): Promise<T> {
    let lastError: unknown

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            return await fn()
        } catch (error) {
            lastError = error


            if (!isRetryable(error)) {
                throw error
            }


            const delay = initialDelay * Math.pow(2, attempt)


            if (attempt < maxRetries - 1) {
                await new Promise(resolve => setTimeout(resolve, delay))
            }
        }
    }

    throw lastError
}
