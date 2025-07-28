import { createFileRoute } from "@tanstack/react-router";
import { Landing } from "../../../components/landing";

export const Route = createFileRoute("/(main)/_homeLayout/")({
	component: Landing,
});
