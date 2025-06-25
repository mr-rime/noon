import { createFileRoute } from "@tanstack/react-router";
import OrdersSection from "@/components/dashboard/components/orders-section";

export const Route = createFileRoute("/(dashboard)/_dashboardLayout/dashboard/orders/")({
	component: OrdersSection,
});
