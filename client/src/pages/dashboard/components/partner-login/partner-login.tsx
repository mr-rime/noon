import { useMutation } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { PartnerLoginSchema, type PartnerLoginSchemaType } from '../../schema'
import { LOGIN_STORE } from '@/graphql/store'
import { dashboard_icons, PartnerLogo } from '../../constants'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function PartnerLogin() {
  const { register, handleSubmit } = useForm<PartnerLoginSchemaType>({
    resolver: zodResolver(PartnerLoginSchema),
  })
  const [loginStore, { loading }] = useMutation<{
    loginStore: { success: boolean; message: string; store: any }
  }>(LOGIN_STORE)
  const navigate = useNavigate()
  const { redirect } = useSearch({ from: '/(dashboard)/d/login/' }) as { redirect?: string }

  const handleLogin: SubmitHandler<PartnerLoginSchemaType> = async ({ email, password }) => {
    try {
      const { data } = await loginStore({
        variables: { email, password },
      })
      if (data?.loginStore.success) {
        toast.success(data?.loginStore.message)
        navigate({ to: redirect || '/d/overview', replace: true })
      } else {
        toast.error(data?.loginStore.message || 'Login failed')
      }
    } catch (err) {
      console.error(err)
      toast.error('An error occurred during login')
    }
  }

  return (
    <form
      onSubmit={handleSubmit(handleLogin)}
      className="my-[50px] flex w-[80%] max-w-[450px] flex-col items-center justify-center rounded-[4px] bg-white p-[30px] shadow-sm">
      <div className="flex items-center justify-center">
        <PartnerLogo width={40} height={40} />
        {dashboard_icons.partnerTitleIcon}
      </div>
      <div className="flex flex-col items-center justify-center">
        <h1 className="mt-[20px] text-[1.4rem]">Sign In To Your Account</h1>
        <h4 className="mt-[5px] text-[14px]">Enter your details to login to your account</h4>
      </div>
      <div className="mt-5 flex w-full flex-col items-center justify-center">
        <Input
          {...register('email')}
          type="email"
          placeholder="Email or username ('username@p1234')"
          className="w-full "
          input={{
            className: 'w-full text-[#404553] focus:border-[#404553] h-[43px]',
          }}
        />
      </div>
      <div className="mt-5 flex w-full flex-col items-center justify-center">
        <Input
          {...register('password')}
          type="password"
          placeholder="password"
          className="w-full "
          input={{
            className: 'w-full text-[#404553] focus:border-[#404553] h-[43px]',
          }}
        />
      </div>
      <div className="mt-[30px] w-full">
        {loading ? (
          <Button type="button" className="flex h-[43px] w-full items-center justify-center normal-case">
            <Loader2 className="animate-spin" size={20} />
          </Button>
        ) : (
          <Button type="submit" className="h-[43px] w-full normal-case">
            Login
          </Button>
        )}
      </div>
      {/* <div className="mt-5 flex items-center space-x-2">
        <p>Register as a new partner?</p>
        {loading ? (
          <button disabled className="cursor-pointer text-[#3866df]">
            click here
          </button>
        ) : (
          <button
            onClick={() => {
              navigate({ search: () => ({ page: 'register' }) })
              setForm('register')
            }}
            className="cursor-pointer text-[#3866df]">
            click here
          </button>
        )}
      </div> */}
    </form>
  )
}
