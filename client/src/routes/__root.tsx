import * as React from 'react'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { Header } from '../components/header'

export const Route = createRootRoute({
    component: RootComponent,
})

function RootComponent() {
    return (
        <React.Fragment>
            <Header />
            <div className='site-container'>
                <Outlet />
            </div>
        </React.Fragment>
    )
}
