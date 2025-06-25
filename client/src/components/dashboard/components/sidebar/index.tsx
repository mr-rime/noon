import { SidebarLinks } from "./components/sidebar-links";
import { StoreAvatar } from "./components/store-avatar";

export function DashboardSidebar() {
	return (
		<aside className="fixed top-0 left-0 z-[1] w-full max-w-[315px] h-screen overflow-y-auto bg-white px-6 py-9 flex flex-col gap-4 border-r border-[#E4E4E7]">
			<StoreAvatar />
			<SidebarLinks />
		</aside>
	);
}
