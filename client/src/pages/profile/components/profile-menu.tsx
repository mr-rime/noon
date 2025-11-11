import { useLocation, useNavigate } from '@tanstack/react-router'
import { memo } from 'react'
import { cn } from '../../../utils/cn'
import { matchesExpectedRoute } from '../../../utils/matchesExpectedRoute'
import { profile_page_icons } from '../constants/icons'

export const ProfileMenu = memo(() => {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <section className="flex flex-col items-start gap-[4px] rounded-[12px] bg-white p-[8px]">
      <ul className="w-full space-y-1.5">
        <li className="w-full">
          <button
            onClick={() => navigate({ to: '/orders' })}
            className={cn(
              'flex h-[48px] w-full cursor-pointer items-center space-x-[16px] rounded-[8px] p-[0_8px] transition-colors hover:bg-[#f2f2f2cc]',
              (pathname === '/orders' || matchesExpectedRoute(pathname, ['/orders/track/order/:orderId'])) &&
              'bg-[#fffcd1] font-bold hover:bg-[#fffcd1] ',
            )}>
            {profile_page_icons.bookIcon}
            <span>Orders</span>
          </button>
        </li>
      </ul>
    </section>
  )
})
