import { AlertCircle, RefreshCw, Home, FileQuestion } from 'lucide-react'
import { Button } from './ui/button'

interface ErrorFallbackProps {
    error?: Error
    resetError?: () => void
    title?: string
    message?: string
}

export function ErrorFallback({
    error,
    resetError,
    title = 'Oops, something went wrong!',
    message = 'We encountered an unexpected error. Don\'t worry, we\'re working on it.',
}: ErrorFallbackProps) {
    const errorMessage = error?.message || 'An unknown error occurred'

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50 p-4">
            <div className="max-w-lg w-full">
                <div className="flex justify-center mb-6">
                    <div className="p-4 bg-red-100 rounded-full">
                        <AlertCircle className="h-16 w-16 text-red-600" />
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-3">{title}</h1>
                    <p className="text-gray-600 mb-6">{message}</p>

                    <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                        <div className="flex items-start gap-2">
                            <FileQuestion className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-700 mb-1">
                                    Error Message
                                </p>
                                <p className="text-sm text-gray-600 break-all font-mono">
                                    {errorMessage}
                                </p>
                            </div>
                        </div>
                    </div>

                
                    <div className="flex flex-col sm:flex-row gap-3">
                        {resetError && (
                            <Button
                                onClick={resetError}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                            >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Try Again
                            </Button>
                        )}
                        <Button
                            onClick={() => window.location.reload()}
                            className="flex-1"
                        >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Reload Page
                        </Button>
                        <Button
                            onClick={() => (window.location.href = '/')}
                            className="flex-1"
                        >
                            <Home className="h-4 w-4 mr-2" />
                            Go Home
                        </Button>
                    </div>
                </div>

                <p className="text-center text-sm text-gray-500 mt-6">
                    If the problem persists, please contact support.
                </p>
            </div>
        </div>
    )
}
