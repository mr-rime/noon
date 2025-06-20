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
import { SignupFormSchema, type SignupFormSchemaType } from "../schema";
import { zodResolver } from "@hookform/resolvers/zod";

export function SignupFormContent({
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
        watch } = useForm<SignupFormSchemaType>({
            resolver: zodResolver(SignupFormSchema)
        })
        
    const [login, { loading }] = useMutation<{
        login: {
            success: boolean,
            message: string,
            user: User
        }
    }>(LOGIN);


    const handleLogin: SubmitHandler<SignupFormSchemaType> = async ({ email, password }) => {
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
                First Name
            </label>
            <input
                id="firstName"
                type="text"
                placeholder="First name"
                className={cn(
                    'w-full p-2 rounded-lg h-[48px] border outline-none border-gray-300 focus:border-gray-500 transition-all',
                    isPending ? 'opacity-70' : 'opacity-100'
                )}
                {...register("firstName")}
                style={{ transitionDuration: '200ms' }}
                disabled={isPending}
                autoComplete="firstName"
                required
            />
            <label htmlFor="email" className="sr-only">
                First Name
            </label>
            <input
                id="lastName"
                type="text"
                placeholder="Last name"
                className={cn(
                    'w-full p-2 rounded-lg mt-4  h-[48px] border outline-none border-gray-300 focus:border-gray-500 transition-all',
                    isPending ? 'opacity-70' : 'opacity-100'
                )}
                {...register("lastName")}
                style={{ transitionDuration: '200ms' }}
                disabled={isPending}
                autoComplete="lastName"
                required
            />
            <label htmlFor="email" className="sr-only">
                Email for sign up
            </label>
            <input
                id="email"
                type="email"
                placeholder={'Please enter your email address'}
                className={cn(
                    'w-full p-2 rounded-lg mt-4  h-[48px] border outline-none border-gray-300 focus:border-gray-500 transition-all',
                    isPending ? 'opacity-70' : 'opacity-100'
                )}
                {...register("email")}
                style={{ transitionDuration: '200ms' }}
                disabled={isPending}
                autoComplete="email"
                required
            />
            <input
                id="password"
                type="text"
                placeholder={'Please enter your password'}
                className={cn(
                    'w-full p-2 rounded-lg h-[48px] mt-4 border outline-none border-gray-300 focus:border-gray-500 transition-all',
                    isPending ? 'opacity-70' : 'opacity-100'
                )}
                {...register("password")}
                style={{ transitionDuration: '200ms' }}
                disabled={isPending}
                autoComplete="password"
                required
            />

            {
                (watch("email") === "" || watch("password") === "") ?
                    <button type="button" className="text-[#7e859b] bg-[#f0f1f4] transition-colors w-full h-[48px] text-[14px] font-bold uppercase p-[16px] rounded-lg mt-2">
                        Sign up
                    </button>
                    : <button type="submit" className="text-white bg-[#3866df] hover:bg-[#3e72f7] transition-colors cursor-pointer w-full h-[48px] text-[14px] font-bold uppercase p-[16px] rounded-lg mt-2 flex items-center justify-center"> {loading ? <Loader2 size={20} className="animate-spin transition-all" /> : "Continue"}</button>
            }
        </form>
    );
}