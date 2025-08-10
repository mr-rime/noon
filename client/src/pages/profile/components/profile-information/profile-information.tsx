import { useQuery } from '@apollo/client'
import Cookies from 'js-cookie'
import { ContactInformation } from './components/contact-information'
import { PersonalInformation } from './components/personal-information'
import type { User } from '@/types'
import { GET_USER } from '@/graphql/user'
import { Button } from '@/components/ui/button'

export function ProfileInformation() {
  const { data, loading } = useQuery<{ getUser: { user: User } }>(GET_USER, {
    variables: { hash: Cookies.get('hash') || '' },
  })
  return (
    <section className="h-screen w-full">
      <h1 className="font-bold text-[28px]">Profile</h1>
      <p className="text-[#7e859b] text-[1rem]">View & Update Your Personal and Contact Information</p>

      <section className="mt-5 ">
        <ContactInformation user={data?.getUser.user} loading={loading} />
        <PersonalInformation user={data?.getUser.user} loading={loading} />
        <Button
          disabled
          className="mt-5 h-[48px] w-full max-w-[300px] rounded-[8px] bg-[#7e859b] px-[32px] text-[#cbcfd7] text-[14px] uppercase hover:bg-[#7e859b]">
          Update Profile
        </Button>
      </section>
    </section>
  )
}
