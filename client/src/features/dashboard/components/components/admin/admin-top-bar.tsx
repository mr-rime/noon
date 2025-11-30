import { SidebarTrigger } from "../ui/sidebar"


export function AdminTopBar() {
    return (
        <div className="border-border border-b bg-background backdrop-blur">
            <div className="flex h-16 items-center justify-between px-6">
                <div className="flex items-center gap-4">
                    <SidebarTrigger className="h-8 w-8" />
                </div>
            </div>
        </div>
    )
}