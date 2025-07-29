import { useLocation, useNavigate } from '@tanstack/react-router'
import { ChartColumnBig, Package, ShoppingBag } from 'lucide-react'
import { memo } from 'react'
import { cn } from '@/utils/cn'

export const SidebarLinks = memo(() => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const normalizedPath = pathname.replace(/\/+$/, '')

  return (
    <section className="flex flex-col items-start gap-[4px] rounded-[12px] bg-white p-[8px]">
      <h3 className="mb-2 ml-3 font-bold text-[#6a6a6a] text-[12px] uppercase">Menu</h3>
      <ul className="ml-3 w-full space-y-4">
        <li className="w-full">
          <button
            onClick={() => navigate({ to: '/dashboard' })}
            className={cn(
              'flex h-[48px] w-full cursor-pointer items-center space-x-[10px] rounded-[8px] p-[0_8px] transition-colors',
              normalizedPath === '/dashboard' ? 'bg-[#fffcd1] font-bold text-[#544e03]' : 'hover:bg-[#f2f2f2cc]',
            )}>
            <ChartColumnBig size={22} />
            <span>Dashboard</span>
          </button>
        </li>
        <li className="w-full">
          <button
            onClick={() => navigate({ to: '/dashboard/products' })}
            className={cn(
              'flex h-[48px] w-full cursor-pointer items-center space-x-[10px] rounded-[8px] p-[0_8px] transition-colors',
              normalizedPath.startsWith('/dashboard/products')
                ? 'bg-[#fffcd1] font-bold text-[#544e03]'
                : 'hover:bg-[#f2f2f2cc]',
            )}>
            <Package size={22} />
            <span>Products</span>
          </button>
        </li>
        <li className="w-full">
          <button
            onClick={() => navigate({ to: '/dashboard/orders' })}
            className={cn(
              'flex h-[48px] w-full cursor-pointer items-center space-x-[10px] rounded-[8px] p-[0_8px] transition-colors',
              normalizedPath.startsWith('/dashboard/orders')
                ? 'bg-[#fffcd1] font-bold text-[#544e03]'
                : 'hover:bg-[#f2f2f2cc]',
            )}>
            <ShoppingBag size={22} />
            <span>Orders</span>
          </button>
        </li>
      </ul>
    </section>
  )
})
