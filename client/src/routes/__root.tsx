import * as React from 'react'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { Header } from '../components/header'
import { Toaster } from 'sonner'

export const Route = createRootRoute({
    component: RootComponent,
})

function RootComponent() {
    return (
        <React.Fragment>
            <Header />
            <Outlet />
            <Toaster closeButton theme='light' richColors position='top-right' />

        </React.Fragment>
    )
}