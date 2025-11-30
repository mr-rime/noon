import { createLazyFileRoute } from "@tanstack/react-router";
import { AdminTrackingPage } from "@/features/dashboard/components/pages/tracking";

export const Route = createLazyFileRoute("/(dashboard)/d/_dashboardLayout/tracking/")({
  component: AdminTrackingPage,
});