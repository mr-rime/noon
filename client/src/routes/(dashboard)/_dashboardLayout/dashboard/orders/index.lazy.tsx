import { createLazyFileRoute } from "@tanstack/react-router";
import OrdersSection from "@/components/dashboard/components/orders-section";

export const Route = createLazyFileRoute("/(dashboard)/_dashboardLayout/dashboard/orders/")({
	component: OrdersSection,
});
