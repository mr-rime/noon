import { useEffect, useState } from "react";
import { animateElement } from "../../../utils/animateElement";
import { cn } from "../../../utils/cn";
import { LOGIN } from "../../../graphql/auth";
import { useMutation } from "@apollo/client";
import { emailRegex } from "../../../constants/validators-regex";
import Cookies from 'js-cookie';

export function FormContent({
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
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [errors, setErrors] = useState({ email: "", password: "" })
    const [login,] = useMutation(LOGIN);

    const validate = () => {
        const newErrors = { email: "", password: "" };
        let isValid = true;

        if (!emailRegex.test(email)) {
            newErrors.email = "Invalid email";
            isValid = false;
        }

        if (password.length < 8 || !/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
            newErrors.password = "Password must contain at least 8 characters, one letter, and one number";
        }

        setErrors(newErrors);
        return isValid;
    };


    const handleLogin = async () => {
        if (validate()) {
            console.log("hi")
            const { data } = await login({ variables: { email, password } })
            if (data.login.success) {
                Cookies.set('hash', data.login.user[0].hash)
                onClose()
            }
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
        <div className="w-full">
            <label htmlFor="email" className="sr-only">
                {isLogin ? 'Email for login' : 'Email for sign up'}
            </label>
            <input
                ref={inputRef}
                id="email"
                type="email"
                placeholder={isLogin ? 'Please enter your email' : 'Please enter your email address'}
                className={cn(
                    'w-full p-2 rounded-lg h-[48px] border outline-none border-gray-300 focus:border-gray-500 transition-all',
                    isPending ? 'opacity-70' : 'opacity-100'
                )}
                onChange={(e) => setEmail(e.target.value)}
                style={{ transitionDuration: '200ms' }}
                disabled={isPending}
                autoComplete="email"
                required
            />
            <input
                ref={inputRef}
                id="password"
                type="text"
                placeholder={'Please enter your password'}
                className={cn(
                    'w-full p-2 rounded-lg h-[48px] mt-4 border outline-none border-gray-300 focus:border-gray-500 transition-all',
                    isPending ? 'opacity-70' : 'opacity-100'
                )}
                onChange={(e) => setPassword(e.target.value)}
                style={{ transitionDuration: '200ms' }}
                disabled={isPending}
                autoComplete="password"
                required
            />

            {
                (email === "" || password === "") ?
                    <button className="text-[#7e859b] bg-[#f0f1f4] transition-colors w-full h-[48px] text-[14px] font-bold uppercase p-[16px] rounded-lg mt-2">Continue</button>
                    : <button onClick={async () => await handleLogin()} className="text-white bg-[#3866df] hover:bg-[#3e72f7] transition-colors cursor-pointer w-full h-[48px] text-[14px] font-bold uppercase p-[16px] rounded-lg mt-2">Continue</button>
            }
        </div>
    );
}