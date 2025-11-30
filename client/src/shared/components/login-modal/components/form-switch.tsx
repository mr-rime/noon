import { useRef, useState, useTransition } from 'react'
import { animateElement } from '../../../utils/animateElement'
import { cn } from '../../../utils/cn'
import { LoginFormContent } from './login-form-content'
import { SignupFormContent } from './signup-form-content'
import type { FormSwitchProps, FormDirection } from '@/shared/types/auth'

export function FormSwitch({
  inputRef,
  onClose,
}: FormSwitchProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [direction, setDirection] = useState<FormDirection>('right')
  const formRef = useRef<HTMLDivElement>(null)
  const activeTabRef = useRef<HTMLButtonElement>(null)
  const [isPending, startTransition] = useTransition()

  const handleSwitch = (login: boolean) => {
    if (isLogin === login || isPending) return

    startTransition(() => {
      setDirection(login ? 'right' : 'left')
      setIsLogin(login)
    })

    if (activeTabRef.current) {
      animateElement(
        activeTabRef.current,
        [
          { transform: 'scale(0.95)', opacity: 0.8 },
          { transform: 'scale(1)', opacity: 1 },
        ],
        { duration: 150 },
      )
    }

    if (formRef.current) {
      animateElement(
        formRef.current,
        [
          {
            opacity: 0,
            transform: `translateX(${direction === 'right' ? '-10px' : '10px'})`,
          },
          { opacity: 1, transform: 'translateX(0)' },
        ],
        { duration: 200 },
      )
    }
  }

  return (
    <div className="w-full items-center justify-center">
      <div className="relative mb-4 flex w-full items-center justify-center rounded-[10px] bg-[#404553] p-1 text-white">
        <button
          ref={isLogin ? activeTabRef : null}
          onClick={() => handleSwitch(true)}
          className={cn(
            'relative z-10 h-full w-1/2 cursor-pointer rounded-lg p-1 text-white transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white',
            isLogin && 'text-[#404553]',
          )}
          disabled={isPending}
          aria-pressed={isLogin}>
          Log in
        </button>
        <button
          ref={isLogin ? null : activeTabRef}
          onClick={() => handleSwitch(false)}
          className={cn(
            'relative z-10 w-1/2 cursor-pointer rounded-lg p-1 text-white transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white',
            !isLogin && 'text-[#404553]',
          )}
          disabled={isPending}
          aria-pressed={!isLogin}>
          Sign up
        </button>
        <div
          className={cn(
            'absolute top-1 left-1 h-[calc(100%-0.5rem)] w-[calc(50%-0.3rem)] rounded-lg bg-white transition-all duration-300',
            isLogin ? 'translate-x-0' : 'translate-x-full',
            isPending ? 'opacity-80' : 'opacity-100',
          )}
          aria-hidden="true"
        />
      </div>

      <div ref={formRef} className="flex w-full flex-col items-center justify-center" aria-busy={isPending}>
        {isLogin ? (
          <LoginFormContent isLogin={isLogin} isPending={isPending} inputRef={inputRef} onClose={onClose} />
        ) : (
          <SignupFormContent isLogin={isLogin} isPending={isPending} inputRef={inputRef} onClose={onClose} />
        )}
      </div>
    </div>
  )
}
