import { useEffect } from "react";
import { animateElement } from "../../../utils/animateElement";
import { cn } from "../../../utils/cn";

export function FormContent({
    isLogin,
    isPending,
    inputRef
}: {
    isLogin: boolean;
    isPending: boolean;
    inputRef: React.RefObject<HTMLInputElement | null>;
}) {
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
                    'w-full p-2 rounded-lg border outline-none border-gray-300 focus:border-gray-500 transition-all',
                    isPending ? 'opacity-70' : 'opacity-100'
                )}
                style={{ transitionDuration: '200ms' }}
                disabled={isPending}
                autoComplete="email"
                required
            />
        </div>
    );
}