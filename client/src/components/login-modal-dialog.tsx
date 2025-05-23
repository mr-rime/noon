import { useEffect, useRef, useState, useTransition } from 'react';
import { cn } from '../utils/cn';
import { animateElement } from '../utils/animateElement';
import { useCanvasAnimation } from '../hooks/use-canvas-animation';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';

export function LoginModalDialog({ onClose }: { onClose: () => void }) {
    const {
        containerRef,
        imageRef,
        canvasRef,
        dialogRef,
        overlayRef
    } = useCanvasAnimation();

    console.log('renders login modal dialog');


    const handleClose = () => {
        if (dialogRef.current && overlayRef.current) {
            const animations = [
                animateElement(overlayRef.current,
                    [{ opacity: 0.5 }, { opacity: 0 }],
                    { duration: 150 }
                ),
                animateElement(dialogRef.current, [
                    { opacity: 1, transform: 'scale(1)' },
                    { opacity: 0, transform: 'scale(0.95)' }
                ], { duration: 200 })
            ];

            Promise.all(animations.map(a => a.finished)).then(onClose);
        } else {
            onClose();
        }
    };

    // juss for ssr
    if (typeof window === "undefined") return null;

    return createPortal(
        <>
            <div
                ref={overlayRef}
                className="fixed top-0 left-0 w-full h-full bg-black opacity-0"
                style={{ transition: "opacity 150ms ease-out" }}
                onClick={handleClose}
            />
            <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="login-dialog-title"
                className="fixed top-0 left-0 w-full h-full flex items-center justify-center opacity-0"
                style={{
                    transform: "scale(0.95)",
                    transition:
                        "opacity 200ms ease-out, transform 200ms cubic-bezier(0.16, 1, 0.3, 1)",
                }}
            >
                <div className="relative bg-white rounded-lg w-[400px] overflow-hidden transition-all duration-200">
                    <button
                        onClick={handleClose}
                        className="absolute top-3 right-3 z-50 p-1 rounded-full bg-gray-100 transition-colors"
                        aria-label="Close login dialog"
                    >
                        <X />
                    </button>

                    <img
                        ref={imageRef}
                        src="/media/imgs/random-items.png"
                        alt="Source"
                        className="hidden"
                    />
                    <div
                        ref={containerRef}
                        className="relative h-[200px] overflow-hidden bg-gray-100"
                    >
                        <canvas ref={canvasRef} className="w-full h-full" />
                    </div>

                    <div className="p-4">
                        <h2
                            id="login-dialog-title"
                            className="text-xl font-bold mb-4 w-full text-center"
                        >
                            Hala! Let's get started
                        </h2>
                        <FormSwitch />
                    </div>
                </div>
            </div>
        </>,
        document.body
    );
}

function FormSwitch() {
    const [isLogin, setIsLogin] = useState(true);
    const [direction, setDirection] = useState<'left' | 'right'>('right');
    const formRef = useRef<HTMLDivElement>(null);
    const activeTabRef = useRef<HTMLButtonElement>(null);
    const [isPending, startTransition] = useTransition();

    const handleSwitch = (login: boolean) => {
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
                        'relative z-10 text-white p-1 h-full rounded-lg w-1/2 cursor-pointer transition-colors duration-200',
                        isLogin && 'text-[#404553]'
                    )}
                    disabled={isPending}
                >
                    Log in
                </button>
                <button
                    ref={!isLogin ? activeTabRef : null}
                    onClick={() => handleSwitch(false)}
                    className={cn(
                        'relative z-10 text-white p-1 rounded-lg w-1/2 cursor-pointer transition-colors duration-200',
                        !isLogin && 'text-[#404553]'
                    )}
                    disabled={isPending}
                >
                    Sign up
                </button>
                <div
                    className={cn(
                        'absolute left-1 top-1 h-[calc(100%-0.5rem)] w-[calc(50%-0.3rem)] bg-white rounded-lg transition-all duration-300',
                        isLogin ? 'translate-x-0' : 'translate-x-full',
                        isPending ? 'opacity-80' : 'opacity-100'
                    )}
                />
            </div>

            <div
                ref={formRef}
                className='flex flex-col items-center justify-center'
                aria-busy={isPending}
            >
                <FormContent isLogin={isLogin} isPending={isPending} />
            </div>
        </div>
    );
}

function FormContent({ isLogin, isPending }: { isLogin: boolean; isPending: boolean }) {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (inputRef.current && !isPending) {
            animateElement(inputRef.current, [
                { transform: 'scale(0.98)' },
                { transform: 'scale(1)' }
            ], { duration: 150 });
        }
    }, [isLogin, isPending]);

    return isLogin ? (
        <input
            ref={inputRef}
            type='text'
            placeholder='Please enter email'
            className={cn(
                'w-full p-2 rounded-lg border outline-none border-gray-300 focus:border-gray-500 transition-all',
                isPending ? 'opacity-70' : 'opacity-100'
            )}
            style={{ transitionDuration: '200ms' }}
            disabled={isPending}
        />
    ) : (
        <input
            ref={inputRef}
            type='text'
            placeholder='Please enter your email address'
            className={cn(
                'w-full p-2 rounded-lg border outline-none border-gray-300 focus:border-gray-500 transition-all',
                isPending ? 'opacity-70' : 'opacity-100'
            )}
            style={{ transitionDuration: '200ms' }}
            disabled={isPending}
        />
    );
}