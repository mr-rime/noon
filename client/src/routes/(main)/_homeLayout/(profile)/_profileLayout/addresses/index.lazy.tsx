import { createLazyFileRoute } from "@tanstack/react-router";
import { Addresses } from "../../../../../../components/profile-page/components/addresses";

export const Route = createLazyFileRoute("/(main)/_homeLayout/(profile)/_profileLayout/addresses/")({
	component: Addresses,
});
