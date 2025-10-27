import { Link } from '@tanstack/react-router'
import { AlertCircle, Home, RefreshCw, ArrowLeft } from 'lucide-react'
import { Button } from './ui/button'

interface RouteErrorBoundaryProps {
    error?: any
}

export function RouteErrorBoundary({ error: errorProp }: RouteErrorBoundaryProps) {
    const error = errorProp || (window as any)?.__TANSTACK_ROUTER_ERROR__


    void errorProp


    if (error?.status === 404) {
        return <NotFoundPage />
    }

    if (error?.status === 403) {
        return <ForbiddenPage />
    }

    if (error?.status >= 500) {
        return <ServerErrorPage error={error} />
    }


    return <GenericErrorPage error={error} />
}


function NotFoundPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white p-4">
            <div className="max-w-md w-full text-center">
                { }
                <div className="flex justify-center mb-6">
                    <div className="p-4 bg-blue-100 rounded-full">
                        <AlertCircle className="h-20 w-20 text-blue-600" />
                    </div>
                </div>

                { }
                <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                    Page Not Found
                </h2>
                <p className="text-gray-600 mb-8">
                    Oops! The page you're looking for doesn't exist or has been moved.
                </p>

                { }
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                        onClick={() => window.history.back()}
                        className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Go Back
                    </Button>
                    <Link to="/">
                        <Button className="flex items-center gap-2">
                            <Home className="h-4 w-4" />
                            Go Home
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}


function ForbiddenPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white p-4">
            <div className="max-w-md w-full text-center">
                <div className="flex justify-center mb-6">
                    <div className="p-4 bg-orange-100 rounded-full">
                        <AlertCircle className="h-20 w-20 text-orange-600" />
                    </div>
                </div>

                <h1 className="text-6xl font-bold text-gray-900 mb-4">403</h1>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                    Access Forbidden
                </h2>
                <p className="text-gray-600 mb-8">
                    You don't have permission to access this page.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                        onClick={() => window.history.back()}
                        className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Go Back
                    </Button>
                    <Link to="/">
                        <Button className="flex items-center gap-2">
                            <Home className="h-4 w-4" />
                            Go Home
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}


function ServerErrorPage({ error }: { error: any }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white p-4">
            <div className="max-w-md w-full text-center">
                <div className="flex justify-center mb-6">
                    <div className="p-4 bg-red-100 rounded-full">
                        <AlertCircle className="h-20 w-20 text-red-600" />
                    </div>
                </div>

                <h1 className="text-6xl font-bold text-gray-900 mb-4">
                    {error?.status || 500}
                </h1>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                    Server Error
                </h2>
                <p className="text-gray-600 mb-8">
                    Something went wrong on our end. Please try again later.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                        onClick={() => window.location.reload()}
                        className="flex items-center gap-2"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Reload Page
                    </Button>
                    <Link to="/">
                        <Button className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300">
                            <Home className="h-4 w-4" />
                            Go Home
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}


function GenericErrorPage({ error }: { error: any }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white p-4">
            <div className="max-w-md w-full text-center">
                <div className="flex justify-center mb-6">
                    <div className="p-4 bg-gray-100 rounded-full">
                        <AlertCircle className="h-20 w-20 text-gray-600" />
                    </div>
                </div>

                <h1 className="text-6xl font-bold text-gray-900 mb-4">Oops!</h1>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                    Something went wrong
                </h2>
                <p className="text-gray-600 mb-8">
                    We encountered an unexpected error. Please try again.
                </p>

                {error?.message && (
                    <div className="bg-gray-100 rounded-lg p-4 mb-6 text-left">
                        <p className="text-sm text-gray-700 font-mono break-all">
                            {error.message}
                        </p>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                        onClick={() => window.location.reload()}
                        className="flex items-center gap-2"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Reload
                    </Button>
                    <Link to="/">
                        <Button className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300">
                            <Home className="h-4 w-4" />
                            Go Home
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
