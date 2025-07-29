import { createRootRoute, Outlet } from '@tanstack/react-router'
import * as React from 'react'
import { Toaster } from 'sonner'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <React.Fragment>
      <Outlet />
      {/* <TanStackRouterDevtools initialIsOpen={false} position='bottom-right' /> */}
      <Toaster closeButton theme="light" richColors position="top-right" />
    </React.Fragment>
  )
}
