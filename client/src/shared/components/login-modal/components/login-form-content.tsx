import { useMutation } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import Cookies from 'js-cookie'
import { useEffect } from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { LoginFormSchema, type LoginFormSchemaType } from '../schema/schema'
import { LOGIN } from '@/shared/api/auth'
import type { User } from '@/shared/types'
import { GET_USER } from '@/shared/api/user'
import { animateElement } from '@/shared/utils/animateElement'
import { Input } from '@/shared/components/ui/input'
import { cn } from '@/shared/utils/cn'
import { GET_HOME } from "@/features/landing/api/home";
import useUserHashStore from '@/store/user-hash/user-hash'
import { GET_WISHLISTS } from '@/features/wishlist/api/wishlist'
import { GET_CART_ITEMS } from '@/features/cart/api/cart'
import { BouncingLoading } from '@/shared/components/ui/bouncing-loading'
import type { LoginFormContentProps } from '@/shared/types/auth'

export function LoginFormContent({
  isLogin,
  isPending,
  inputRef,
  onClose,
}: LoginFormContentProps) {
  const setHash = useUserHashStore((state) => state.setHash)
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
    refetchQueries: [GET_USER, GET_HOME, GET_WISHLISTS, GET_CART_ITEMS],
    awaitRefetchQueries: true,
  })

  const handleLogin: SubmitHandler<LoginFormSchemaType> = async ({ email, password }) => {
    try {
      const { data } = await login({ variables: { email, password } })
      if (data?.login.success) {
        setHash(data.login.user.hash)
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

  }, [inputRef, isLogin, isPending])

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
          {loading ? <BouncingLoading /> : 'Continue'}
        </button>
      )}
    </form>
  )
}
