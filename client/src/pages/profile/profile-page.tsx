import { Outlet } from '@tanstack/react-router'
import { Sidebar } from './components/sidebar'

export function ProfilePageLayout() {
  return (
    <main className="site-container flex h-full items-start gap-[32px] p-[32px_24px]">
      <Sidebar />
      <div className="w-full max-w-[1140px]">
        <Outlet />
      </div>
    </main>
  )
}
