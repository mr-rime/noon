import { useMutation } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { PartnerLoginSchema, type PartnerLoginSchemaType } from '../../schema'
import { LOGIN_PARTNER } from '@/graphql/partner'
import { dashboard_icons, PartnerLogo } from '../../constants'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function PartnerLogin({ setForm }: { setForm: React.Dispatch<React.SetStateAction<'login' | 'register'>> }) {
  const { register, handleSubmit } = useForm<PartnerLoginSchemaType>({
    resolver: zodResolver(PartnerLoginSchema),
  })
  const [createPartner, { loading }] = useMutation<{
    loginPartner: { success: boolean; message: string }
  }>(LOGIN_PARTNER)
  const navigate = useNavigate({ from: '/partners' })

  const handleLogin: SubmitHandler<PartnerLoginSchemaType> = async ({ email, password }) => {
    try {
      const { data } = await createPartner({
        variables: { business_email: email, password: password },
      })
      toast.success(data?.loginPartner.message)
      navigate({ to: '/d/overview' })
    } catch (err) {
      console.error(err)
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
      <div className="mt-5 flex items-center space-x-2">
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
      </div>
    </form>
  )
}
