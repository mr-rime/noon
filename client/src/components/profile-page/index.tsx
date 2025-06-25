import { Outlet } from "@tanstack/react-router";
import { Sidebar } from "./components/sidebar";

export function ProfilePageLayout() {
	return (
		<main className="site-container p-[32px_24px] flex items-start gap-[32px] h-full">
			<Sidebar />
			<div className="w-full max-w-[1140px]">
				<Outlet />
			</div>
		</main>
	);
}
