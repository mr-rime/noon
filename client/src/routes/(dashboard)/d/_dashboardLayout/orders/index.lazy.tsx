import { createLazyFileRoute } from "@tanstack/react-router";
import { AdminOrdersPage } from "@/pages/dashboard/pages/orders";

export const Route = createLazyFileRoute("/(dashboard)/d/_dashboardLayout/orders/")({
	component: AdminOrdersPage,
});
