import { Orders } from "@/features/profile";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/(main)/_homeLayout/(profile)/_profileLayout/orders/")({
	component: Orders,
});
