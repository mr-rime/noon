import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(main)/_homeLayout/wishlist/")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/(main)/_homeLayout/wishlist/"!</div>;
}
