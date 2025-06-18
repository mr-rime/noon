import { useState } from "react"
import Login from "../login"
import Register from "../register"
import { useSearch } from "@tanstack/react-router"


export function PartnerPage() {
    const page = useSearch({ from: "/(dashboard)/dashboard/partners/", select: (state) => state.page });
    const [form, setForm] = useState<"login" | "register">(page || "login")
    return (
        <div className="partner-container">
            {
                form === "login" ? <Login setForm={setForm} /> : <Register setForm={setForm} />
            }
        </div >
    )
}
