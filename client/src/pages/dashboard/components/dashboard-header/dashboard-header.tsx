import { PanelLeft } from 'lucide-react'

export function DashboardHeader() {
  return (
    <header className="flex h-16 items-center justify-between px-6">
      <button className="inline-flex h-8 w-8 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium text-sm transition-all hover:bg-secondary hover:text-secondary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0">
        <PanelLeft />
      </button>
    </header>
  )
}
