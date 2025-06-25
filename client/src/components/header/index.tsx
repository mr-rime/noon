import { useQuery } from "@apollo/client";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import Cookies from "js-cookie";
import { useMemo } from "react";
import { GET_USER } from "../../graphql/user";
import type { User } from "../../types";
import { matchesExpectedRoute } from "../../utils/matchesExpectedRoute";
import { LoginButtonWithModalDialog } from "../login-modal/components/login-button-with-modal-dialog";
import { Separator } from "../ui/separator";
import { Skeleton } from "../ui/skeleton";
import { SearchInput } from "./components/search";
import { UserMenu } from "./components/user-menu";
import { header_icons } from "./constants/icons";

const expectedRoutes = [
	"/orders",
	"/returns",
	"/profile",
	"/addresses",
	"/payments",
	"/security-settings",
	"/orders/track/order/:orderId",
];

export function Header() {
	const { data, loading } = useQuery<{ getUser: { user: User } }>(GET_USER, {
		variables: { hash: Cookies.get("hash") || "" },
	});
	const { pathname } = useLocation();
	const navigate = useNavigate();
	const user = useMemo(() => data?.getUser.user, [data?.getUser.user]);
	const isLoading = useMemo(() => loading, [loading]);

	const memoizedSearchInput = useMemo(() => <SearchInput />, []);

	return (
		<header className="bg-[#FEEE00] h-[64px] w-full flex items-center justify-center">
			<div className="flex items-center justify-center w-[70%]  site-container">
				<Link to="/" className="text-[25px]">
					noon
				</Link>
				{memoizedSearchInput}
				{loading ? (
					<Skeleton className="h-[20px] w-[160px] rounded-[2px] bg-[#d4d4d46b]" />
				) : matchesExpectedRoute(pathname, expectedRoutes) ? (
					<button className="cursor-pointer" onClick={() => navigate({ to: "/" })}>
						{header_icons.homeIcon}
					</button>
				) : user ? (
					<UserMenu user={user} loading={isLoading} />
				) : (
					<LoginButtonWithModalDialog />
				)}

				<Separator className=" w-[1px] h-[20px] mx-3 bg-[#404553] opacity-[0.2]" />

				{!matchesExpectedRoute(pathname, expectedRoutes) && (
					<Link to={"/"} className="mx-3">
						{user ? (
							<div>{header_icons.heartIcon}</div>
						) : (
							<LoginButtonWithModalDialog>
								{({ open, isOpen }) => (
									<div onClick={open} aria-expanded={isOpen}>
										{header_icons.heartIcon}
									</div>
								)}
							</LoginButtonWithModalDialog>
						)}
					</Link>
				)}
				<Link to={"/cart"} className="mx-1">
					{header_icons.cartIcon}
				</Link>
			</div>
		</header>
	);
}
