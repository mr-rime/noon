import { Calendar, Pencil } from "lucide-react";
import { Input } from "../../../../ui/input";
import { Select } from "../../../../ui/select";
import { profil_information_icons } from "../constants/icons";
import { Radio } from "../../../../ui/radio";
import { useState } from "react";

export function PersonalInformation() {
    const [selected, setSelected] = useState("male")

    return (
        <section className="bg-white rounded-[20px] p-[32px] mt-7">
            <h2 className="text-[18px] font-bold">
                Personal Information
            </h2>

            <div className="mt-5 flex items-center space-x-6 flex-wrap">
                <Input id="firstName" name="firstName" labelContent="First name" icon={<Pencil size={14} color="#7E859B" />} iconDirection="right" placeholder="First Name" input={{ className: "bg-white rounded-[12px] w-[300px] h-[58px] p-[8px_12px] indent-0 focus:border-[#00f]" }} />
                <Input id="lastName" name="lastName" labelContent="Last name" icon={<Pencil size={14} color="#7E859B" />} iconDirection="right" placeholder="First Name" input={{ className: "bg-white rounded-[12px] w-[300px] h-[58px] p-[8px_12px] indent-0 focus:border-[#00f]" }} />
                <Select options={[]} labelContent="Nationality" className="bg-white rounded-[12px] w-[300px] h-[58px] p-[8px_12px]" />

                <div className="mt-10 flex items-center space-x-6">
                    <div>
                        <Input id="birthday" name="birthday" labelContent="Birthday" readOnly icon={<Calendar size={20} color="#7E859B" />} iconDirection="right" value={"01/01/2007"} placeholder="birthday" input={{ className: "bg-[#f3f4f8] rounded-[12px] w-[300px] h-[58px] p-[8px_12px] indent-0 " }} />
                        <span className="text-[#008000] flex items-center space-x-2 text-[12px] mt-3">
                            {profil_information_icons.discountTagIcon}
                            <span>
                                Get offers on your special day
                            </span>
                        </span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Radio label="Male" name="gender" value="male" checked={selected === "male"} onChange={(e) => setSelected(e.target.value)} />
                        <Radio label="Female" name="gender" value="female" checked={selected === "female"} onChange={(e) => setSelected(e.target.value)} />
                    </div>
                </div>
            </div>
        </section>
    )
}
