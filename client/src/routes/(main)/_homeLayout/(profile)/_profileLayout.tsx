import { ProfilePageLayout } from "@/pages/profile";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(main)/_homeLayout/(profile)/_profileLayout")({
	component: ProfilePageLayout,
});
