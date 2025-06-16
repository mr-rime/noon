import { Pencil } from "lucide-react";
import { Input } from "../../../../ui/input";
import { Skeleton } from "../../../../ui/skeleton";
import type { User } from "../../../../../types";

export function ContactInformation({ user, loading }: { user: User | undefined, loading: boolean }) {

    return (
        <section className="bg-white rounded-[20px] p-[32px]">
            <h2 className="text-[18px] font-bold">
                Contact Information
            </h2>

            <div className="mt-5 flex items-center space-x-6">
                {
                    loading ? <Skeleton className=" rounded-[12px] w-[300px] h-[58px] p-[8px_12px] mt-8" /> : <Input id="email" name="email" labelContent="Email" value={user?.email} readOnly input={{ className: "bg-[#f3f4f8] rounded-[12px] w-[300px] h-[58px] p-[8px_12px] font-bold indent-0 cursor-not-allowed" }} />
                }
                <div>
                    {loading ? <Skeleton className=" rounded-[12px] w-[300px] h-[58px] p-[8px_12px] mt-8" /> : <Input id="phone" name="phone" value={user?.phone_number} icon={<Pencil size={14} color="#7E859B" />} iconDirection="right" readOnly labelContent="Phone number" placeholder="" input={{ className: "bg-white rounded-[12px] w-[300px] h-[58px] p-[8px_12px] indent-0 cursor-pointer" }} />}
                    {/* <p className="text-[#6a6a6a] text-[12px] my-[6px] h-[20px]">This can be used to login across all noon apps.</p> */}
                </div>
            </div>
        </section>
    )
}
