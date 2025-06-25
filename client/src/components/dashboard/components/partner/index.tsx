import { useSearch } from "@tanstack/react-router";
import { useState } from "react";
import Login from "../login";
import Register from "../register";

export function PartnerPage() {
	const page = useSearch({
		from: "/(dashboard)/partners/",
		select: (state) => state.page,
	});
	const [form, setForm] = useState<"login" | "register">(page || "login");
	return (
		<div className="partner-container">{form === "login" ? <Login setForm={setForm} /> : <Register setForm={setForm} />}</div>
	);
}
