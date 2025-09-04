import { DashboardOverview } from "@/pages/dashboard";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/(dashboard)/_dashboardLayout/d/overview/")({
	component: DashboardOverview,
});
