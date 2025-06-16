import { useState, useTransition, useRef } from "react";
import { animateElement } from "../../../utils/animateElement";
import { cn } from "../../../utils/cn";
import { FormContent } from "./form-content";

export function FormSwitch({ inputRef, onClose }: { inputRef: React.RefObject<HTMLInputElement | null>, onClose: () => void }) {
    const [isLogin, setIsLogin] = useState(true);
    const [direction, setDirection] = useState<'left' | 'right'>('right');
    const formRef = useRef<HTMLDivElement>(null);
    const activeTabRef = useRef<HTMLButtonElement>(null);
    const [isPending, startTransition] = useTransition();

    const handleSwitch = (login: boolean) => {
        if (isLogin === login || isPending) return;

        startTransition(() => {
            setDirection(login ? 'right' : 'left');
            setIsLogin(login);
        });

        if (activeTabRef.current) {
            animateElement(activeTabRef.current, [
                { transform: 'scale(0.95)', opacity: 0.8 },
                { transform: 'scale(1)', opacity: 1 }
            ], { duration: 150 });
        }

        if (formRef.current) {
            animateElement(formRef.current, [
                { opacity: 0, transform: `translateX(${direction === 'right' ? '-10px' : '10px'})` },
                { opacity: 1, transform: 'translateX(0)' }
            ], { duration: 200 });
        }
    };

    return (
        <div className='w-full items-center justify-center'>
            <div className='relative flex items-center mb-4 w-full justify-center bg-[#404553] text-white p-1 rounded-[10px]'>
                <button
                    ref={isLogin ? activeTabRef : null}
                    onClick={() => handleSwitch(true)}
                    className={cn(
                        'relative z-10 text-white p-1 h-full rounded-lg w-1/2 cursor-pointer transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white',
                        isLogin && 'text-[#404553]'
                    )}
                    disabled={isPending}
                    aria-pressed={isLogin}
                >
                    Log in
                </button>
                <button
                    ref={!isLogin ? activeTabRef : null}
                    onClick={() => handleSwitch(false)}
                    className={cn(
                        'relative z-10 text-white p-1 rounded-lg w-1/2 cursor-pointer transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white',
                        !isLogin && 'text-[#404553]'
                    )}
                    disabled={isPending}
                    aria-pressed={!isLogin}
                >
                    Sign up
                </button>
                <div
                    className={cn(
                        'absolute left-1 top-1 h-[calc(100%-0.5rem)] w-[calc(50%-0.3rem)] bg-white rounded-lg transition-all duration-300',
                        isLogin ? 'translate-x-0' : 'translate-x-full',
                        isPending ? 'opacity-80' : 'opacity-100'
                    )}
                    aria-hidden="true"
                />
            </div>

            <div
                ref={formRef}
                className='flex flex-col items-center justify-center w-full'
                aria-busy={isPending}
            >
                <FormContent isLogin={isLogin} isPending={isPending} inputRef={inputRef} onClose={onClose} />
            </div>
        </div>
    );
}

