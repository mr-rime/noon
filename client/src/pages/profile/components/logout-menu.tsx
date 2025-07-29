import { useMutation } from '@apollo/client'
import Cookies from 'js-cookie'
import { toast } from 'sonner'
import client from '../../../config/apollo'
import { LOGOUT } from '../../../graphql/auth'
import { GET_USER } from '../../../graphql/user'
import { cn } from '../../../utils/cn'
import { profile_page_icons } from '../constants/icons'

export function LogoutMenu() {
  const [logout] = useMutation(LOGOUT)
  const handleLogout = async () => {
    try {
      const { data } = await logout()
      await client.refetchQueries({ include: [GET_USER] })
      Cookies.remove('hash')
      toast.success(data.logout.message)
    } catch (e) {
      console.error(e)
      toast.error('Something went wrong!')
    }
  }
  return (
    <section className="flex flex-col items-start gap-[4px] rounded-[12px] bg-white p-[8px]">
      <h3 className="mb-2 ml-3 font-bold text-[#6a6a6a] text-[12px] uppercase">Others</h3>
      <ul className="w-full">
        <li className="w-full">
          <button
            onClick={handleLogout}
            className={cn(
              'flex h-[48px] w-full cursor-pointer items-center space-x-[16px] rounded-[8px] p-[0_8px] transition-colors hover:bg-[#ff000014]',
            )}>
            {profile_page_icons.signoutIcon}
            <span>Sign out</span>
          </button>
        </li>
      </ul>
    </section>
  )
}
