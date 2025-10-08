import { Button } from '../ui/button'
import { REGISTER_STORE } from '@/graphql/store'
import { useMutation } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { PartnerRegisterSchema, type PartnerRegisterSchemaType } from '../../schema'
import { PartnerLogo, dashboard_icons } from '../../constants'
import { Input } from '@/components/ui/input'

export function PartnerRegister({ setForm }: { setForm: React.Dispatch<React.SetStateAction<'login' | 'register'>> }) {
  const { register, handleSubmit } = useForm<PartnerRegisterSchemaType>({
    resolver: zodResolver(PartnerRegisterSchema),
  })
  const [registerStore, { loading }] = useMutation<{
    registerStore: { success: boolean; message: string; store: any }
  }>(REGISTER_STORE)
  const navigate = useNavigate({ from: '/d/partners' })
  const handleCreatePartner: SubmitHandler<PartnerRegisterSchemaType> = async ({ email, password, storeName }) => {
    try {
      const { data } = await registerStore({
        variables: {
          name: storeName,
          email,
          password,
        },
      })
      if (data?.registerStore.success) {
        toast.success(data?.registerStore.message)
        navigate({ to: '/d/overview' })
      } else {
        toast.error(data?.registerStore.message || 'Registration failed')
      }
    } catch (err) {
      console.error(err)
      toast.error('An error occurred during registration')
    }
  }
  return (
    <form
      onSubmit={handleSubmit(handleCreatePartner)}
      className="my-[50px] flex w-[80%] max-w-[450px] flex-col items-center justify-center rounded-[4px] bg-white p-[30px] shadow-sm">
      <div className="flex items-center justify-center">
        <PartnerLogo width={40} height={40} />
        {dashboard_icons.partnerTitleIcon}
      </div>
      <div className="flex flex-col items-center justify-center">
        <h1 className="mt-[20px] text-[1.4rem]">Lets get you signed in</h1>
        <h4 className="mt-[5px] text-[14px]">Enter your email address to get started</h4>
      </div>
      <div className="mt-5 flex w-full flex-col items-center justify-center">
        <Input
          type="text"
          {...register('storeName')}
          placeholder="Enter your store name"
          className="w-full "
          input={{
            className: 'w-full text-[#404553] focus:border-[#404553] h-[43px]',
          }}
        />
      </div>
      <div className="mt-5 flex w-full flex-col items-center justify-center">
        <Input
          type="email"
          {...register('email')}
          placeholder="Enter your email"
          className="w-full "
          input={{
            className: 'w-full text-[#404553] focus:border-[#404553] h-[43px]',
          }}
        />
      </div>
      <div className="mt-5 flex w-full flex-col items-center justify-center">
        <Input
          type="password"
          {...register('password')}
          placeholder="Enter your password"
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
            Register
          </Button>
        )}
      </div>
      <div className="mt-5 flex items-center space-x-2">
        <p>Already have an account?</p>
        {loading ? (
          <button disabled className="cursor-pointer text-[#3866df]">
            click here
          </button>
        ) : (
          <button
            onClick={() => {
              navigate({ search: () => ({ page: 'login' }) })
              setForm('login')
            }}
            className="cursor-pointer text-[#3866df]">
            click here
          </button>
        )}
      </div>
    </form>
  )
}
