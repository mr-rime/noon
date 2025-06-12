import { Outlet } from "@tanstack/react-router";
import { Sidebar } from "./components/sidebar";

export function ProfilePageLayout() {
    return (
        <main className="site-container p-[32px_24px] flex items-start gap-[32px] h-full">
            <Sidebar />
            <Outlet />
        </main>
    )
}
