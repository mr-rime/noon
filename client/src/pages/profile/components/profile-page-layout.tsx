import { Outlet } from '@tanstack/react-router'
import { Sidebar } from './sidebar'
import React from 'react'

export function ProfilePageLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="site-container flex h-full items-start gap-[32px] p-[32px_24px]">
            <Sidebar />
            <div className="w-full max-w-[1140px]">
                {children}
                <Outlet />
            </div>
        </main>
    )
}
