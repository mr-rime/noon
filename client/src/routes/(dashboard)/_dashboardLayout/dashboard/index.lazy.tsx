import { createLazyFileRoute } from "@tanstack/react-router";
import { DashboardSection } from "../../../../components/dashboard/components/dashboard-section";

export const Route = createLazyFileRoute("/(dashboard)/_dashboardLayout/dashboard/")({
	component: DashboardSection,
});
