import OrdersSection from "@/pages/dashboard/components/orders-section";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/(dashboard)/_dashboardLayout/d/orders/")({
	component: OrdersSection,
});
