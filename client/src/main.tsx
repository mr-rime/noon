import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { routeTree } from './routeTree.gen'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { ApolloProvider } from '@apollo/client'
import client from './apollo'

const router = createRouter({ routeTree, scrollRestoration: true });


declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <ApolloProvider client={client}>
        <RouterProvider router={router} defaultPendingMinMs={0} defaultPendingMs={0} />
      </ApolloProvider>
    </StrictMode>,
  )
}