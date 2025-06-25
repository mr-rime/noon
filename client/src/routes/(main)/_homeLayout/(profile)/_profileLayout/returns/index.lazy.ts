import { createLazyFileRoute } from "@tanstack/react-router";
import { Returns } from "../../../../../../components/profile-page/components/returns";

export const Route = createLazyFileRoute("/(main)/_homeLayout/(profile)/_profileLayout/returns/")({
	component: Returns,
});
