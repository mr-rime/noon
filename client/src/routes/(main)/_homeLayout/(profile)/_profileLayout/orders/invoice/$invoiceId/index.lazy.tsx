import { createLazyFileRoute } from "@tanstack/react-router";
import { OrderInvoicePage } from "@/pages/profile/components/order-invoice";

export const Route = createLazyFileRoute("/(main)/_homeLayout/(profile)/_profileLayout/orders/invoice/$invoiceId/")({
  component: OrderInvoicePage,
});