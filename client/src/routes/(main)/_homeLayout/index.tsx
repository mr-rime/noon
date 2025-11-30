import { Landing } from "@/features/landing";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(main)/_homeLayout/")({
	component: Landing,
});
