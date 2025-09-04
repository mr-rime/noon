import type { AppRouter } from '@/router'
import type { Link } from '@tanstack/react-router'

type LinkProps = React.ComponentProps<typeof Link<AppRouter>>
type LinkTo = LinkProps['to']

export type SidebarLink = {
  title: string
  path: LinkTo
  isExtendable: boolean
  icon: React.ReactNode
}
