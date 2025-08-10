import { useLocation, useNavigate } from '@tanstack/react-router'
import { memo } from 'react'
import { cn } from '../../../utils/cn'
import { profile_page_icons } from '../constants/icons'

export const MyAccountMenu = memo(() => {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <section className="flex flex-col items-start gap-[4px] rounded-[12px] bg-white p-[8px]">
      <h3 className="mb-2 ml-3 font-bold text-[#6a6a6a] text-[12px] uppercase">My Account</h3>
      <ul className="w-full">
        <li className="w-full">
          <button
            onClick={() => navigate({ to: '/profile' })}
            className={cn(
              'flex h-[48px] w-full cursor-pointer items-center space-x-[16px] rounded-[8px] p-[0_8px] transition-colors hover:bg-[#f2f2f2cc]',
              pathname === '/profile' && 'bg-[#fffcd1] font-bold hover:bg-[#fffcd1] ',
            )}>
            {profile_page_icons.profileIcon}
            <span>Profile</span>
          </button>
        </li>
        <li>
          <button
            onClick={() => navigate({ to: '/addresses' })}
            className={cn(
              'flex h-[48px] w-full cursor-pointer items-center space-x-[16px] rounded-[8px] p-[0_8px] transition-colors hover:bg-[#f2f2f2cc]',
              pathname === '/addresses' && 'bg-[#fffcd1] font-bold hover:bg-[#fffcd1] ',
            )}>
            {profile_page_icons.locationIcon}
            <span>Addresses</span>
          </button>
        </li>
        <li>
          <button
            onClick={() => navigate({ to: '/payments' })}
            className={cn(
              'flex h-[48px] w-full cursor-pointer items-center space-x-[16px] rounded-[8px] p-[0_8px] transition-colors hover:bg-[#f2f2f2cc]',
              pathname === '/payments' && 'bg-[#fffcd1] font-bold hover:bg-[#fffcd1] ',
            )}>
            {profile_page_icons.stackIcon}
            <span>Payments</span>
          </button>
        </li>

        <li>
          <button
            onClick={() => navigate({ to: '/security-settings' })}
            className={cn(
              'flex h-[48px] w-full cursor-pointer items-center space-x-[16px] rounded-[8px] p-[0_8px] transition-colors hover:bg-[#f2f2f2cc]',
              pathname === '/security-settings' && 'bg-[#fffcd1] font-bold hover:bg-[#fffcd1] ',
            )}>
            {profile_page_icons.shieldUser}
            <span>Security Settings</span>
          </button>
        </li>
      </ul>
    </section>
  )
})
