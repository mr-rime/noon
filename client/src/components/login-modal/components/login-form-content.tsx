import { useMutation } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import Cookies from 'js-cookie'
import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { LoginFormSchema, type LoginFormSchemaType } from '../schema/schema'
import { LOGIN } from '@/graphql/auth'
import type { User } from '@/types'
import { GET_USER } from '@/graphql/user'
import { animateElement } from '@/utils/animateElement'
import { Input } from '@/components/ui/input'
import { cn } from '@/utils/cn'

export function LoginFormContent({
  isLogin,
  isPending,
  inputRef,
  onClose,
}: {
  isLogin: boolean
  isPending: boolean
  inputRef: React.RefObject<HTMLInputElement | null>
  onClose: () => void
}) {
  const { register, handleSubmit, watch } = useForm<LoginFormSchemaType>({
    resolver: zodResolver(LoginFormSchema),
  })
  const [login, { loading }] = useMutation<{
    login: {
      success: boolean
      message: string
      user: User
    }
  }>(LOGIN, {
    refetchQueries: [GET_USER],
    awaitRefetchQueries: true,
  })

  const handleLogin: SubmitHandler<LoginFormSchemaType> = async ({ email, password }) => {
    try {
      const { data } = await login({ variables: { email, password } })
      if (data?.login.success) {
        Cookies.set('hash', data.login.user.hash)
        onClose()
        toast.success(data.login.message, { position: 'top-right' })
      }
    } catch (e) {
      console.error(e)
      toast.error('Something went wrong!', { position: 'top-right' })
    }
  }

  useEffect(() => {
    if (inputRef.current && !isPending) {
      animateElement(inputRef.current, [{ transform: 'scale(0.98)' }, { transform: 'scale(1)' }], { duration: 150 })
    }
  }, [isLogin, isPending])

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
            'h-[48px] w-full rounded-lg border border-gray-300 p-2 outline-none transition-all focus:border-gray-500',
            isPending ? 'opacity-70' : 'opacity-100',
          ),
        }}
        {...register('email')}
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
            'mt-4 h-[48px] w-full rounded-lg border border-gray-300 p-2 outline-none transition-all focus:border-gray-500',
            isPending ? 'opacity-70' : 'opacity-100',
          ),
        }}
        {...register('password')}
        style={{ transitionDuration: '200ms' }}
        disabled={isPending}
        autoComplete="password"
        required
      />

      {watch('email') === '' || watch('password') === '' ? (
        <button
          type="button"
          className="mt-4 h-[48px] w-full rounded-lg bg-[#f0f1f4] p-[16px] font-bold text-[#7e859b] text-[14px] uppercase transition-colors ">
          Log in
        </button>
      ) : (
        <button
          type="submit"
          className="mt-4 flex h-[48px] w-full cursor-pointer items-center justify-center rounded-lg bg-[#3866df] p-[16px] font-bold text-[14px] text-white uppercase transition-colors hover:bg-[#3e72f7]">
          {' '}
          {loading ? <Loader2 size={20} className="animate-spin transition-all" /> : 'Continue'}
        </button>
      )}
    </form>
  )
}
