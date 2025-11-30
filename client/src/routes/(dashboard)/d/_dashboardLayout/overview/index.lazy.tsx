import Dashboard from "@/features/dashboard/components/pages/dashboard";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/(dashboard)/d/_dashboardLayout/overview/")({
	component: Dashboard,
});
