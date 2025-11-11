import { client } from "@/config/apollo";
import { GET_USER } from "@/graphql/user";
import { ProfilePageLayout } from "@/pages/profile";
import type { GetUserResponse } from "@/types";
import { createFileRoute, redirect } from "@tanstack/react-router";
import Cookies from "js-cookie";

export const Route = createFileRoute("/(main)/_homeLayout/(profile)/_profileLayout")({
	loader: async () => {
		const hash = Cookies.get('hash');
		const { data } = await client.query<GetUserResponse>({
			query: GET_USER,
			variables: { hash: hash || '' },
			fetchPolicy: 'network-only',
		})

		const user = data.getUser.user;

		if (!user) throw redirect({ to: "/", replace: true, reloadDocument: true })
	},
	component: ProfilePageLayout,
});
