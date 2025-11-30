import { createLazyFileRoute } from "@tanstack/react-router";
import { AdminOrdersPage } from "@/features/dashboard/components/pages/orders";

export const Route = createLazyFileRoute("/(dashboard)/d/_dashboardLayout/orders/")({
	component: AdminOrdersPage,
});
