import { Outlet } from "@tanstack/react-router";
import { DashboardSidebar } from "./components/sidebar";

export function DashboardPage() {
    return (
        <main className="w-full bg-[#F7F7FA] flex items-start">
            <div className="hidden md:block">
                <div className="w-[315px]" />
                <DashboardSidebar />
            </div>
            <div className="w-full">
                <Outlet />
            </div>
        </main>
    )
}
