import { useMutation } from '@apollo/client'
import Cookies from 'js-cookie'
import { toast } from 'sonner'
import { profile_page_icons } from '../constants/icons'
import { GET_HOME } from "@/features/landing/api/home";
import { LOGOUT } from '@/shared/api/auth'
import { GET_USER } from '@/shared/api/user'
import { cn } from '@/shared/utils/cn'
import { GET_WISHLISTS } from '@/features/wishlist/api/wishlist'
import { GET_CART_ITEMS } from '@/features/cart/api/cart'
import { useNavigate } from '@tanstack/react-router'

export function LogoutMenu() {
  const [logout] = useMutation(LOGOUT, {
    refetchQueries: [GET_USER, GET_HOME, GET_WISHLISTS, GET_CART_ITEMS],
    awaitRefetchQueries: true,
  })

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const { data } = await logout()
      Cookies.remove('hash')
      Cookies.remove('NOON_SESSION_ID')
      toast.success(data.logout.message)
      navigate({ to: '/', reloadDocument: true })
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
