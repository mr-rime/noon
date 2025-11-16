import { Outlet } from '@tanstack/react-router'
import { Sidebar } from './sidebar'
import React from 'react'

export function ProfilePageLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="site-container flex h-full flex-col lg:flex-row lg:items-start lg:gap-8 px-4 sm:px-6 lg:px-[45px] py-4 sm:py-6">
            <Sidebar />
            <div className="w-full max-w-[1140px] flex-1 min-w-0">
                {children}
                <Outlet />
            </div>
        </main>
    )
}
