import { ApolloProvider } from '@apollo/client'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import client from './apollo'
import { routeTree } from './routeTree.gen'

const router = createRouter({ routeTree, scrollRestoration: true })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export default function App() {
  return (
    <ApolloProvider client={client}>
      <RouterProvider router={router} defaultPendingMinMs={0} defaultPendingMs={0} defaultPreload="intent" />
    </ApolloProvider>
  )
}
