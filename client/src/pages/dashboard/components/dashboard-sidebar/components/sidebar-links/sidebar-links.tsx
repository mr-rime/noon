import { useLocation, useNavigate } from '@tanstack/react-router'
import { memo } from 'react'
import { cn } from '@/utils/cn'
import { SIDEBAR_LINKS } from './sidebar-links.constants'

export const SidebarLinks = memo(() => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const normalizedPath = pathname.replace(/\/+$/, '')

  return (
    <section className="flex flex-col items-start gap-[4px] rounded-[12px] bg-white ">
      <ul className=" mt-6 w-full space-y-4">
        {SIDEBAR_LINKS.map((link) => (
          <li className="w-full">
            <button
              onClick={() => navigate({ to: link.path })}
              className={cn(
                'flex h-[40px] w-full cursor-pointer items-center space-x-[10px] rounded-[10px] p-[0_8px] transition-colors',
                normalizedPath === link.path ? 'bg-[#F4F4F5] font-bold text-[#18181b]' : 'hover:bg-[#f2f2f2cc]',
              )}>
              {link.icon}
              <span className="text-[14px] capitalize">{link.title}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
})
