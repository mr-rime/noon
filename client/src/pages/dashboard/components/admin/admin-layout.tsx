import { SidebarProvider } from "../ui/sidebar"
import { AdminSidebar } from "./admin-sidebar"
import { AdminTopBar } from "./admin-top-bar"

interface AdminLayoutProps {
    children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full bg-background">
                <AdminSidebar />
                <div className="flex flex-1 flex-col">
                    <AdminTopBar />
                    <main className="flex-1 bg-gradient-dashboard p-6">
                        {children}
                    </main>
                </div>
            </div>
        </SidebarProvider>
    )
}