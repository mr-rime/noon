import { ApolloProvider } from '@apollo/client'
import { RouterProvider } from '@tanstack/react-router'
import { router } from './router'
import { client } from './config/apollo'
import { ErrorBoundary } from './components/error-boundary'

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export default function App({ subdomain }: { subdomain?: string | null }) {
  return (
    <ErrorBoundary>
      <ApolloProvider client={client}>
        <RouterProvider
          router={router}
          context={{ subdomain }}
          defaultPendingMinMs={0}
          defaultPendingMs={0}
          defaultPreload="intent"
        />
      </ApolloProvider>
    </ErrorBoundary>
  )
}
