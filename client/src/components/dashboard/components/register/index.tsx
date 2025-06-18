import { PartnerLogo } from '../../constants/components'
import { dashboard_icons } from '../../constants/icons'
import { Input } from '../../../ui/input'
import { Button } from '../../../ui/button'
import { useNavigate } from '@tanstack/react-router';

export default function Register({ setForm }: { setForm: React.Dispatch<React.SetStateAction<"login" | "register">> }) {
    const navigate = useNavigate({ from: "/dashboard/partners" });
    return (
        <div className="flex flex-col items-center justify-center bg-white shadow-sm rounded-[4px] w-[80%] max-w-[450px] p-[30px] my-[50px]">
            <div className="flex items-center justify-center">
                <PartnerLogo width={40} height={40} />
                {dashboard_icons.partnerTitleIcon}
            </div>
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-[1.4rem] mt-[20px]">
                    Lets get you signed in
                </h1>
                <h4 className="text-[14px] mt-[5px]">Enter your email address to get started</h4>
            </div>
            <div className="flex flex-col items-center justify-center w-full mt-5">
                <Input type='email' placeholder="Enter your email" className="w-full " input={{ className: "w-full text-[#404553] focus:border-[#404553] h-[43px]" }} />
            </div>
            <div className="flex flex-col items-center justify-center w-full mt-5">
                <Input type='password' placeholder="Enter your password" className="w-full " input={{ className: "w-full text-[#404553] focus:border-[#404553] h-[43px]" }} />
            </div>
            <div className="w-full mt-[30px]">
                <Button className="h-[43px] w-full normal-case">Register</Button>
            </div>
            <div className="flex items-center mt-5 space-x-2">
                <p>
                    Already have an account?
                </p>
                <button onClick={() => {
                    navigate({ search: () => ({ page: "login" }) })
                    setForm("login")
                }} className="text-[#3866df] cursor-pointer">click here</button>
            </div>
        </div>
    )
}
