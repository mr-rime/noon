import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { CREATE_PARTNER } from "../../../../graphql/partner";
import { Button } from "../../../ui/button";
import { Input } from "../../../ui/input";
import { PartnerLogo } from "../../constants/components";
import { dashboard_icons } from "../../constants/icons";
import { PartnerRegisterSchema, type PartnerRegisterSchemaType } from "../../schema";

export default function Register({ setForm }: { setForm: React.Dispatch<React.SetStateAction<"login" | "register">> }) {
	const { register, handleSubmit } = useForm<PartnerRegisterSchemaType>({
		resolver: zodResolver(PartnerRegisterSchema),
	});
	const [createPartner, { loading }] = useMutation<{
		createPartner: { success: boolean; message: string };
	}>(CREATE_PARTNER);
	const navigate = useNavigate({ from: "/partners" });
	const handleCreatePartner: SubmitHandler<PartnerRegisterSchemaType> = async ({ email, password, storeName }) => {
		try {
			const { data } = await createPartner({
				variables: {
					business_email: email,
					store_name: storeName,
					password: password,
				},
			});
			if (data?.createPartner.success) {
				toast.success(data?.createPartner.message);
				navigate({ to: "/dashboard" });
			} else {
				toast.error(data?.createPartner.message);
			}
		} catch (err) {
			console.error(err);
		}
	};
	return (
		<form
			onSubmit={handleSubmit(handleCreatePartner)}
			className="flex flex-col items-center justify-center bg-white shadow-sm rounded-[4px] w-[80%] max-w-[450px] p-[30px] my-[50px]"
		>
			<div className="flex items-center justify-center">
				<PartnerLogo width={40} height={40} />
				{dashboard_icons.partnerTitleIcon}
			</div>
			<div className="flex flex-col items-center justify-center">
				<h1 className="text-[1.4rem] mt-[20px]">Lets get you signed in</h1>
				<h4 className="text-[14px] mt-[5px]">Enter your email address to get started</h4>
			</div>
			<div className="flex flex-col items-center justify-center w-full mt-5">
				<Input
					type="text"
					{...register("storeName")}
					placeholder="Enter your store name"
					className="w-full "
					input={{
						className: "w-full text-[#404553] focus:border-[#404553] h-[43px]",
					}}
				/>
			</div>
			<div className="flex flex-col items-center justify-center w-full mt-5">
				<Input
					type="email"
					{...register("email")}
					placeholder="Enter your email"
					className="w-full "
					input={{
						className: "w-full text-[#404553] focus:border-[#404553] h-[43px]",
					}}
				/>
			</div>
			<div className="flex flex-col items-center justify-center w-full mt-5">
				<Input
					type="password"
					{...register("password")}
					placeholder="Enter your password"
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
						Register
					</Button>
				)}
			</div>
			<div className="flex items-center mt-5 space-x-2">
				<p>Already have an account?</p>
				{loading ? (
					<button disabled className="text-[#3866df] cursor-pointer">
						click here
					</button>
				) : (
					<button
						onClick={() => {
							navigate({ search: () => ({ page: "login" }) });
							setForm("login");
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
