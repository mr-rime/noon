import { useCallback } from 'react'
import { toast } from 'sonner'
import { showErrorToast, logError, normalizeError, isRetryable } from '@/shared/utils/error-handler'


export function useErrorHandler() {
    const handleError = useCallback((error: unknown, context?: string) => {
        const normalizedError = normalizeError(error)


        logError(error, context)


        showErrorToast(error)

        return normalizedError
    }, [])

    const handleMutationError = useCallback(
        async (error: unknown, context?: string) => {
            const normalizedError = handleError(error, context)


            return normalizedError
        },
        [handleError]
    )

    const handleQueryError = useCallback(
        (error: unknown, context?: string) => {
            const normalizedError = handleError(error, context)


            return {
                error: normalizedError,
                hasError: true,
                isRetryable: isRetryable(error),
            }
        },
        [handleError]
    )

    const showSuccess = useCallback((message: string) => {
        toast.success(message)
    }, [])

    const showInfo = useCallback((message: string) => {
        toast.info(message)
    }, [])

    const showWarning = useCallback((message: string) => {
        toast.warning(message)
    }, [])

    return {
        handleError,
        handleMutationError,
        handleQueryError,
        showSuccess,
        showInfo,
        showWarning,
    }
}
