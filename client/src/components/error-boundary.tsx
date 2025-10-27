import { Component, type ErrorInfo, type ReactNode } from 'react'
import { ErrorFallback } from './error-fallback'

interface Props {
    children: ReactNode
    fallback?: ReactNode
    onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
    hasError: boolean
    error: Error | null
    errorInfo: ErrorInfo | null
    errorId: string | null
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
            errorId: null,
        }
    }

    static getDerivedStateFromError(error: Error): Partial<State> {
        return {
            hasError: true,
            error,
            errorId: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        }
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo)

        this.setState({
            errorInfo,
        })


        this.props.onError?.(error, errorInfo)


        console.error('Error Details:', {
            error: error.message,
            stack: error.stack,
            componentStack: errorInfo.componentStack,
        })
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
            errorId: null,
        })
    }

    render() {
        if (this.state.hasError) {

            if (this.props.fallback) {
                return this.props.fallback
            }


            return (
                <ErrorFallback
                    error={this.state.error || undefined}
                    resetError={this.handleReset}
                />
            )
        }

        return this.props.children
    }
}