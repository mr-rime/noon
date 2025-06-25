import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { LOGIN_PARTNER } from "../../../../graphql/partner";
import { Button } from "../../../ui/button";
import { Input } from "../../../ui/input";
import { PartnerLogo } from "../../constants/components";
import { dashboard_icons } from "../../constants/icons";
import { PartnerLoginSchema, type PartnerLoginSchemaType } from "../../schema";

export default function Login({ setForm }: { setForm: React.Dispatch<React.SetStateAction<"login" | "register">> }) {
	const { register, handleSubmit } = useForm<PartnerLoginSchemaType>({
		resolver: zodResolver(PartnerLoginSchema),
	});
	const [createPartner, { loading }] = useMutation<{
		loginPartner: { success: boolean; message: string };
	}>(LOGIN_PARTNER);
	const navigate = useNavigate({ from: "/partners" });

	const handleLogin: SubmitHandler<PartnerLoginSchemaType> = async ({ email, password }) => {
		try {
			const { data } = await createPartner({
				variables: { business_email: email, password: password },
			});
			toast.success(data?.loginPartner.message);
			navigate({ to: "/dashboard" });
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<form
			onSubmit={handleSubmit(handleLogin)}
			className="flex flex-col items-center justify-center bg-white shadow-sm rounded-[4px] w-[80%] max-w-[450px] p-[30px] my-[50px]"
		>
			<div className="flex items-center justify-center">
				<PartnerLogo width={40} height={40} />
				{dashboard_icons.partnerTitleIcon}
			</div>
			<div className="flex flex-col items-center justify-center">
				<h1 className="text-[1.4rem] mt-[20px]">Sign In To Your Account</h1>
				<h4 className="text-[14px] mt-[5px]">Enter your details to login to your account</h4>
			</div>
			<div className="flex flex-col items-center justify-center w-full mt-5">
				<Input
					{...register("email")}
					type="email"
					placeholder="Email or username ('username@p1234')"
					className="w-full "
					input={{
						className: "w-full text-[#404553] focus:border-[#404553] h-[43px]",
					}}
				/>
			</div>
			<div className="flex flex-col items-center justify-center w-full mt-5">
				<Input
					{...register("password")}
					type="password"
					placeholder="password"
					className="w-full "
					input={{
						className: "w-full text-[#404553] focus:border-[#404553] h-[43px]",
					}}
				/>
			</div>
			<div className="w-full mt-[30px]">
				{loading ? (
					<Button type="button" className="h-[43px] w-full normal-case flex items-center justify-center">
						<Loader2 className="animate-spin" size={20} />
					</Button>
				) : (
					<Button type="submit" className="h-[43px] w-full normal-case">
						Login
					</Button>
				)}
			</div>
			<div className="flex items-center mt-5 space-x-2">
				<p>Register as a new partner?</p>
				{loading ? (
					<button disabled className="text-[#3866df] cursor-pointer">
						click here
					</button>
				) : (
					<button
						onClick={() => {
							navigate({ search: () => ({ page: "register" }) });
							setForm("register");
						}}
						className="text-[#3866df] cursor-pointer"
					>
						click here
					</button>
				)}
			</div>
		</form>
	);
}
