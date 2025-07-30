import OrdersSection from "@/pages/dashboard/components/orders-section";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/(dashboard)/_dashboardLayout/dashboard/orders/")({
	component: OrdersSection,
});
