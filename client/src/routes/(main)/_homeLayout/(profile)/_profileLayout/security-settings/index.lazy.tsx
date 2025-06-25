import { createLazyFileRoute } from "@tanstack/react-router";
import { SecuritySettings } from "../../../../../../components/profile-page/components/security-settings";

export const Route = createLazyFileRoute("/(main)/_homeLayout/(profile)/_profileLayout/security-settings/")({
	component: SecuritySettings,
});
