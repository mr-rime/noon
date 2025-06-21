import { useEffect } from "react";
import { animateElement } from "../../../utils/animateElement";
import { cn } from "../../../utils/cn";
import { LOGIN } from "../../../graphql/auth";
import { useMutation } from "@apollo/client";
import Cookies from 'js-cookie';
import client from "../../../apollo";
import { GET_USER } from "../../../graphql/user";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { User } from "../../../types";
import { useForm, type SubmitHandler } from "react-hook-form"
import { LoginFormSchema, type LoginFormSchemaType } from "../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../../ui/input";


export function LoginFormContent({
    isLogin,
    isPending,
    inputRef,
    onClose
}: {
    isLogin: boolean;
    isPending: boolean;
    inputRef: React.RefObject<HTMLInputElement | null>;
    onClose: () => void
}) {
    const {
        register,
        handleSubmit,
        watch } = useForm<LoginFormSchemaType>({
            resolver: zodResolver(LoginFormSchema)
        })
    const [login, { loading }] = useMutation<{
        login: {
            success: boolean,
            message: string,
            user: User
        }
    }>(LOGIN);


    const handleLogin: SubmitHandler<LoginFormSchemaType> = async ({ email, password }) => {
        try {
            const { data } = await login({ variables: { email, password } })
            if (data?.login.success) {
                Cookies.set('hash', data.login.user.hash)
                await client.refetchQueries({ include: [GET_USER] })
                onClose()
                toast.success(data.login.message, { position: "top-right" })
            }
        } catch (e) {
            console.error(e)
            toast.error("Something went wrong!", { position: "top-right" })
        }
    }



    useEffect(() => {
        if (inputRef.current && !isPending) {
            animateElement(inputRef.current, [
                { transform: 'scale(0.98)' },
                { transform: 'scale(1)' }
            ], { duration: 150 });
        }
    }, [isLogin, isPending]);

    return (
        <form onSubmit={handleSubmit(handleLogin)} className="w-full">
            <label htmlFor="email" className="sr-only">
                {isLogin ? 'Email for login' : 'Email for sign up'}
            </label>
            <Input
                id="email"
                type="email"
                placeholder={isLogin ? 'Please enter your email' : 'Please enter your email address'}
                input={{
                    className: cn(
                        'w-full p-2 rounded-lg h-[48px] border outline-none border-gray-300 focus:border-gray-500 transition-all',
                        isPending ? 'opacity-70' : 'opacity-100'
                    )
                }}
                {...register("email")}
                style={{ transitionDuration: '200ms' }}
                disabled={isPending}
                autoComplete="email"
                required
            />
            <Input
                id="password"
                type="text"
                placeholder={'Please enter your password'}
                input={{
                    className: cn(
                        'w-full p-2 rounded-lg h-[48px] mt-4 border outline-none border-gray-300 focus:border-gray-500 transition-all',
                        isPending ? 'opacity-70' : 'opacity-100'
                    )
                }}
                {...register("password")}
                style={{ transitionDuration: '200ms' }}
                disabled={isPending}
                autoComplete="password"
                required
            />

            {
                (watch("email") === "" || watch("password") === "") ?
                    <button type="button" className="text-[#7e859b] mt-4 bg-[#f0f1f4] transition-colors w-full h-[48px] text-[14px] font-bold uppercase p-[16px] rounded-lg ">
                        Log in
                    </button>
                    : <button type="submit" className="text-white mt-4 bg-[#3866df] hover:bg-[#3e72f7] transition-colors cursor-pointer w-full h-[48px] text-[14px] font-bold uppercase p-[16px] rounded-lg  flex items-center justify-center"> {loading ? <Loader2 size={20} className="animate-spin transition-all" /> : "Continue"}</button>
            }

        </form>
    );
}