import { SidebarProvider } from "../ui/sidebar"
import { AdminSidebar } from "./admin-sidebar"
import { AdminTopBar } from "./admin-top-bar"


interface AdminLayoutProps {
    children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
    return (
        <SidebarProvider>
            <div className="min-h-screen flex w-full bg-background">
                <AdminSidebar />
                <div className="flex-1 flex flex-col">
                    <AdminTopBar />
                    <main className="flex-1 p-6 bg-gradient-dashboard">
                        {children}
                    </main>
                </div>
            </div>
        </SidebarProvider>
    )
}