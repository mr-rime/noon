import { createFileRoute } from "@tanstack/react-router";
import { HomeLayout } from "../../layouts/home-layout";

export const Route = createFileRoute("/(main)/_homeLayout")({
	component: HomeLayout,
});
