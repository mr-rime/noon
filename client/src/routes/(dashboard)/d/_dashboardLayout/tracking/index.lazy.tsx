import { createLazyFileRoute } from "@tanstack/react-router";
import { AdminTrackingPage } from "@/pages/dashboard/pages/tracking";

export const Route = createLazyFileRoute("/(dashboard)/d/_dashboardLayout/tracking/")({
  component: AdminTrackingPage,
});