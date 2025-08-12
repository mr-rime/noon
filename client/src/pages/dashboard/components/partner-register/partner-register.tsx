import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CREATE_PARTNER } from '@/graphql/partner'
import { useMutation } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { PartnerRegisterSchema, type PartnerRegisterSchemaType } from '../../schema'
import { PartnerLogo, dashboard_icons } from '../../constants'

export default function Register({ setForm }: { setForm: React.Dispatch<React.SetStateAction<'login' | 'register'>> }) {
  const { register, handleSubmit } = useForm<PartnerRegisterSchemaType>({
    resolver: zodResolver(PartnerRegisterSchema),
  })
  const [createPartner, { loading }] = useMutation<{
    createPartner: { success: boolean; message: string }
  }>(CREATE_PARTNER)
  const navigate = useNavigate({ from: '/partners' })
  const handleCreatePartner: SubmitHandler<PartnerRegisterSchemaType> = async ({ email, password, storeName }) => {
    try {
      const { data } = await createPartner({
        variables: {
          business_email: email,
          store_name: storeName,
          password: password,
        },
      })
      if (data?.createPartner.success) {
        toast.success(data?.createPartner.message)
        navigate({ to: '/d/overview' })
      } else {
        toast.error(data?.createPartner.message)
      }
    } catch (err) {
      console.error(err)
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
