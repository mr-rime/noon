import { AlertCircle, X, RefreshCw, AlertTriangle } from 'lucide-react'
import { Button } from './ui/button'

interface ErrorDisplayProps {
    title?: string
    message: string
    error?: Error | string
    onRetry?: () => void
    onDismiss?: () => void
    variant?: 'error' | 'warning' | 'info'
    showDetails?: boolean
    actionLabel?: string
}

export function ErrorDisplay({
    title = 'Something went wrong',
    message,
    error,
    onRetry,
    onDismiss,
    variant = 'error',
    showDetails = false,
    actionLabel = 'Try Again',
}: ErrorDisplayProps) {
    const getVariantStyles = () => {
        switch (variant) {
            case 'warning':
                return {
                    bg: 'bg-amber-50',
                    border: 'border-amber-200',
                    icon: 'text-amber-600',
                    title: 'text-amber-900',
                    text: 'text-amber-800',
                    button: 'bg-amber-600 hover:bg-amber-700',
                }
            case 'info':
                return {
                    bg: 'bg-blue-50',
                    border: 'border-blue-200',
                    icon: 'text-blue-600',
                    title: 'text-blue-900',
                    text: 'text-blue-800',
                    button: 'bg-blue-600 hover:bg-blue-700',
                }
            default:
                return {
                    bg: 'bg-red-50',
                    border: 'border-red-200',
                    icon: 'text-red-600',
                    title: 'text-red-900',
                    text: 'text-red-800',
                    button: 'bg-red-600 hover:bg-red-700',
                }
        }
    }

    const styles = getVariantStyles()
    const errorMessage = error instanceof Error ? error.message : error

    return (
        <div
            className={`${styles.bg} ${styles.border} border rounded-lg p-4 relative`}
        >
            {onDismiss && (
                <button
                    onClick={onDismiss}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Dismiss"
                >
                    <X className="h-5 w-5" />
                </button>
            )}

            <div className="flex gap-3">
                <div className={`flex-shrink-0 ${styles.icon}`}>
                    {variant === 'error' && <AlertCircle className="h-6 w-6" />}
                    {variant === 'warning' && <AlertTriangle className="h-6 w-6" />}
                    {variant === 'info' && <AlertCircle className="h-6 w-6" />}
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className={`font-semibold ${styles.title} mb-1`}>{title}</h3>
                    <p className={`text-sm ${styles.text}`}>{message}</p>

                    {errorMessage && showDetails && (
                        <div className="mt-3">
                            <details className="cursor-pointer">
                                <summary className="text-xs font-medium text-gray-600 hover:text-gray-800 mb-2">
                                    Error Details
                                </summary>
                                <div className="bg-gray-900 text-gray-100 p-3 rounded text-xs font-mono overflow-x-auto">
                                    <pre className="whitespace-pre-wrap break-all">
                                        {error instanceof Error ? error.stack : errorMessage}
                                    </pre>
                                </div>
                            </details>
                        </div>
                    )}

                    {onRetry && (
                        <div className="mt-4">
                            <Button
                                onClick={onRetry}
                                className={`${styles.button} text-white`}
                            >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                {actionLabel}
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}


interface InlineErrorProps {
    message: string
    className?: string
}

export function InlineError({ message, className = '' }: InlineErrorProps) {
    return (
        <div
            className={`flex items-center gap-2 text-red-600 text-sm ${className}`}
        >
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{message}</span>
        </div>
    )
}


export function ErrorSkeleton() {
    return (
        <div className="animate-pulse">
            <div className="bg-gray-100 rounded-lg p-6 space-y-3">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
        </div>
    )
}
