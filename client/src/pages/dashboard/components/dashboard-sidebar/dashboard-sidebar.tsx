import { SidebarLinks } from './components/sidebar-links'
import { StoreAvatar } from './components/store-avatar'

export function DashboardSidebar() {
  return (
    <aside className="fixed top-0 left-0 z-[1] flex h-screen w-full max-w-[315px] flex-col gap-4 overflow-y-auto border-[#E4E4E7] border-r bg-white px-6 py-9">
      <StoreAvatar />
      <SidebarLinks />
    </aside>
  )
}
