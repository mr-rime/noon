import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import * as React from 'react'
import { Toaster } from 'sonner'

type RootContextType = {
  subdomain: string | null
}

export const Route = createRootRouteWithContext<RootContextType>()({
  component: RootComponent,
})

function RootComponent() {
  return (
    <React.Fragment>
      <Outlet />
      {/* <TanStackRouterDevtools initialIsOpen={false} position='bottom-right' /> */}
      <Toaster closeButton theme="light" richColors position="top-right" duration={1000} />
    </React.Fragment>
  )
}
