import { useMutation } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import Cookies from 'js-cookie'
import { useEffect } from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { client } from '../../../config/apollo'
import { REGISTER } from '../../../graphql/auth'
import { GET_USER } from '../../../graphql/user'
import type { User } from '../../../types'
import { animateElement } from '../../../utils/animateElement'
import { cn } from '../../../utils/cn'
import { Input } from '../../ui/input'
import { BouncingLoading } from '@/components/ui/bouncing-loading'
import { SignupFormSchema, type SignupFormSchemaType } from '../schema/schema'
import type { SignupFormContentProps } from '@/types/auth'

export function SignupFormContent({
  isLogin,
  isPending,
  inputRef,
  onClose,
}: SignupFormContentProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid }
  } = useForm<SignupFormSchemaType>({
    resolver: zodResolver(SignupFormSchema),
    mode: 'onChange'
  })

  const [registerUser, { loading }] = useMutation<{
    register: {
      success: boolean
      message: string
      user: User
    }
  }>(REGISTER)

  const handleRegister: SubmitHandler<SignupFormSchemaType> = async ({
    firstName,
    lastName,
    email,
    password
  }) => {
    try {
      const { data } = await registerUser({
        variables: {
          first_name: firstName,
          last_name: lastName || '',
          email,
          password
        }
      })

      if (data?.register.success) {
        Cookies.set('hash', data.register.user.hash)
        await client.refetchQueries({ include: [GET_USER] })
        onClose()
        toast.success(data.register.message, { position: 'top-right' })
      } else {
        toast.error(data?.register.message || 'Registration failed', { position: 'top-right' })
      }
    } catch (e: any) {
      console.error(e)
      const errorMessage = e?.graphQLErrors?.[0]?.message || e?.message || 'Something went wrong!'
      toast.error(errorMessage, { position: 'top-right' })
    }
  }

  useEffect(() => {
    if (inputRef.current && !isPending) {
      animateElement(inputRef.current, [{ transform: 'scale(0.98)' }, { transform: 'scale(1)' }], { duration: 150 })
    }
  }, [inputRef, isLogin, isPending])

  const watchedValues = watch()
  const isFormValid = isValid && watchedValues.firstName && watchedValues.email && watchedValues.password

  return (
    <form onSubmit={handleSubmit(handleRegister)} className="w-full">
      <div className="space-y-4">
        <div>
          <label htmlFor="firstName" className="sr-only">
            First Name
          </label>
          <Input
            id="firstName"
            type="text"
            placeholder="First name"
            input={{
              className: cn(
                'h-[48px] w-full rounded-lg border p-2 outline-none transition-all focus:border-gray-500',
                errors.firstName ? 'border-red-500' : 'border-gray-300',
                isPending ? 'opacity-70' : 'opacity-100',
              ),
            }}
            {...register('firstName')}
            style={{ transitionDuration: '200ms' }}
            disabled={isPending}
            autoComplete="given-name"
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-500">{errors.firstName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="lastName" className="sr-only">
            Last Name
          </label>
          <Input
            id="lastName"
            type="text"
            placeholder="Last name"
            input={{
              className: cn(
                'h-[48px] w-full rounded-lg border p-2 outline-none transition-all focus:border-gray-500',
                errors.lastName ? 'border-red-500' : 'border-gray-300',
                isPending ? 'opacity-70' : 'opacity-100',
              ),
            }}
            {...register('lastName')}
            style={{ transitionDuration: '200ms' }}
            disabled={isPending}
            autoComplete="family-name"
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-500">{errors.lastName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="sr-only">
            Email for sign up
          </label>
          <Input
            id="email"
            type="email"
            placeholder="Please enter your email address"
            input={{
              className: cn(
                'h-[48px] w-full rounded-lg border p-2 outline-none transition-all focus:border-gray-500',
                errors.email ? 'border-red-500' : 'border-gray-300',
                isPending ? 'opacity-70' : 'opacity-100',
              ),
            }}
            {...register('email')}
            style={{ transitionDuration: '200ms' }}
            disabled={isPending}
            autoComplete="email"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="sr-only">
            Password
          </label>
          <Input
            id="password"
            type="password"
            placeholder="Please enter your password"
            input={{
              className: cn(
                'h-[48px] w-full rounded-lg border p-2 outline-none transition-all focus:border-gray-500',
                errors.password ? 'border-red-500' : 'border-gray-300',
                isPending ? 'opacity-70' : 'opacity-100',
              ),
            }}
            {...register('password')}
            style={{ transitionDuration: '200ms' }}
            disabled={isPending}
            autoComplete="new-password"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="sr-only">
            Confirm Password
          </label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            input={{
              className: cn(
                'h-[48px] w-full rounded-lg border p-2 outline-none transition-all focus:border-gray-500',
                errors.confirmPassword ? 'border-red-500' : 'border-gray-300',
                isPending ? 'opacity-70' : 'opacity-100',
              ),
            }}
            {...register('confirmPassword')}
            style={{ transitionDuration: '200ms' }}
            disabled={isPending}
            autoComplete="new-password"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>
          )}
        </div>
      </div>

      {!isFormValid ? (
        <button
          type="button"
          className="mt-4 h-[48px] w-full rounded-lg bg-[#f0f1f4] p-[16px] font-bold text-[#7e859b] text-[14px] uppercase transition-colors">
          Sign up
        </button>
      ) : (
        <button
          type="submit"
          className="mt-4 flex h-[48px] w-full cursor-pointer items-center justify-center rounded-lg bg-[#3866df] p-[16px] font-bold text-[14px] text-white uppercase transition-colors hover:bg-[#3e72f7]">
          {loading ? <BouncingLoading /> : 'Sign up'}
        </button>
      )}
    </form>
  )
}
