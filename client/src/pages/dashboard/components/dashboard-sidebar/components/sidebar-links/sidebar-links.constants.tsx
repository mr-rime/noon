import { LayoutDashboard } from 'lucide-react'
import type { SidebarLink } from './sidebar-links.types'

export const SIDEBAR_LINKS: SidebarLink[] = [
  {
    title: 'Dashboard',
    path: '/d/overview',
    isExtendable: false,
    icon: <LayoutDashboard size={20} />,
  },
]
