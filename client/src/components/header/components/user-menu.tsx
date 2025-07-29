import { useMutation } from '@apollo/client'
import { useNavigate } from '@tanstack/react-router'
import Cookies from 'js-cookie'
import { ChevronDown } from 'lucide-react'
import { memo } from 'react'
import { toast } from 'sonner'
import client from '../../../config/apollo'
import { LOGOUT } from '../../../graphql/auth'
import { GET_USER } from '../../../graphql/user'
import type { User } from '../../../types'
import { cn } from '../../../utils/cn'
import { Dropdown } from '../../ui/dropdown'
import { Separator } from '../../ui/separator'
import { Skeleton } from '../../ui/skeleton'
import { header_icons } from '../constants/icons'

export const UserMenu = memo(({ user, loading }: { user: User; loading: boolean }) => {
  const [logout] = useMutation(LOGOUT)
  const navigate = useNavigate()

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
    <Dropdown
      align="center"
      trigger={(isOpen) => (
        <button className="flex cursor-pointer items-center gap-1 font-bold text-[1rem]">
          <span>Hello</span>
          <span>{user.first_name}</span>
          <ChevronDown size={19} className={cn('transition-transform', isOpen ? 'rotate-180' : '')} />
        </button>
      )}>
      <div className="w-48 bg-white py-2">
        <button
          onClick={() => navigate({ to: '/orders', resetScroll: true })}
          className=" flex w-full cursor-pointer items-center whitespace-nowrap p-[8px_25px] text-center transition-colors hover:bg-[#F3F4F8]">
          {header_icons.ordersIcon}
          <span className="ml-4 text-[1rem]">Orders</span>
        </button>
        <button
          onClick={() => navigate({ to: '/addresses', resetScroll: true })}
          className=" flex w-full cursor-pointer items-center whitespace-nowrap p-[8px_25px] text-center transition-colors hover:bg-[#F3F4F8]">
          {header_icons.addressesIcon}
          <span className="ml-4 text-[1rem]">Addresses</span>
        </button>
        <button
          onClick={() => navigate({ to: '/payments', resetScroll: true })}
          className=" flex w-full cursor-pointer items-center whitespace-nowrap p-[8px_25px] text-center transition-colors hover:bg-[#F3F4F8]">
          {header_icons.paymentsIcon}
          <span className="ml-4 text-[1rem]">Payments</span>
        </button>
        <button
          onClick={() => navigate({ to: '/returns', resetScroll: true })}
          className=" flex w-full cursor-pointer items-center whitespace-nowrap p-[8px_25px] text-center transition-colors hover:bg-[#F3F4F8]">
          {header_icons.returnsIcon}
          <span className="ml-4 text-[1rem]">Returns</span>
        </button>
        <button
          onClick={() => navigate({ to: '/profile', resetScroll: true })}
          className=" flex w-full cursor-pointer items-center whitespace-nowrap p-[8px_25px] text-center transition-colors hover:bg-[#F3F4F8]">
          {header_icons.profileIcon}
          <span className="ml-4 text-[1rem]">Profile</span>
        </button>
        {loading ? (
          <div className="mx-6 mt-1">
            <Skeleton className=" flex h-[25px] w-full items-center rounded-[3px] p-[8px_25px]" />
          </div>
        ) : (
          user && (
            <button
              onClick={() => navigate({ to: '/partners', resetScroll: true })}
              className=" flex w-full cursor-pointer items-center whitespace-nowrap p-[8px_25px] text-center transition-colors hover:bg-[#F3F4F8]">
              {header_icons.dashboardIcon}
              <span className="ml-4 text-[1rem]">Dashboard</span>
            </button>
          )
        )}
        <Separator className="my-2" />
        <button
          onClick={handleLogout}
          className=" flex w-full cursor-pointer items-center justify-center whitespace-nowrap p-[8px_25px] text-center transition-colors hover:bg-[#F3F4F8]">
          <span className="text-center text-[#7e859b] text-[1rem] ">Sign Out</span>
        </button>
      </div>
    </Dropdown>
  )
})
