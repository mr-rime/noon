import { useQuery } from '@apollo/client'
import { Link, useLocation, useNavigate } from '@tanstack/react-router'
import Cookies from 'js-cookie'
import { useMemo } from 'react'
import { GET_USER } from '../../graphql/user'
import type { User } from '../../types'
import { matchesExpectedRoute } from '../../utils/matchesExpectedRoute'
import { LoginButtonWithModalDialog } from '../login-modal/components/login-button-with-modal-dialog'
import { Separator } from '../ui/separator'
import { Skeleton } from '../ui/skeleton'
import { SearchInput } from './components/search'
import { UserMenu } from './components/user-menu'
import { header_icons } from './constants/icons'
import type { CartResponseType } from '../cart-page/types'
import { GET_CART_ITEMS } from '@/graphql/cart'

const expectedRoutes = [
  '/orders',
  '/returns',
  '/profile',
  '/addresses',
  '/payments',
  '/security-settings',
  '/orders/track/order/:orderId',
]

export function Header() {
  const { data, loading } = useQuery<{ getUser: { user: User } }>(GET_USER, {
    variables: { hash: Cookies.get('hash') || '' },
  })

  const { data: cart } = useQuery<CartResponseType>(GET_CART_ITEMS)

  const { pathname } = useLocation()
  const navigate = useNavigate()
  const user = useMemo(() => data?.getUser.user, [data?.getUser.user])
  const isLoading = useMemo(() => loading, [loading])

  const memoizedSearchInput = useMemo(() => <SearchInput />, [])

  return (
    <header className="flex h-[64px] w-full items-center justify-center bg-[#FEEE00]">
      <div className="site-container flex w-[70%] items-center justify-center">
        <Link to="/" className="text-[25px]">
          noon
        </Link>
        {memoizedSearchInput}
        {loading ? (
          <Skeleton className="h-[20px] w-[160px] rounded-[2px] bg-[#d4d4d46b]" />
        ) : matchesExpectedRoute(pathname, expectedRoutes) ? (
          <button className="cursor-pointer" onClick={() => navigate({ to: '/' })}>
            {header_icons.homeIcon}
          </button>
        ) : user ? (
          <UserMenu user={user} loading={isLoading} />
        ) : (
          <LoginButtonWithModalDialog />
        )}

        <Separator className=" mx-3 h-[20px] w-[1px] bg-[#404553] opacity-[0.2]" />

        {!matchesExpectedRoute(pathname, expectedRoutes) && (
          <Link to={'/'} className="mx-3">
            {user ? (
              <Link to="/wishlist">{header_icons.heartIcon}</Link>
            ) : (
              <LoginButtonWithModalDialog>
                {({ open, isOpen }) => (
                  <div onClick={open} aria-expanded={isOpen}>
                    {header_icons.heartIcon}
                  </div>
                )}
              </LoginButtonWithModalDialog>
            )}
          </Link>
        )}
        <Link
          to={'/cart'}
          preload="render"
          className="relative mx-1 text-[#404553] transition-colors hover:text-[#8C8832]">
          {cart?.getCartItems.cartItems?.length! > 0 && (
            <div className="-right-[8px] -top-2 absolute flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#3866DF] font-semibold text-[10px] text-white">
              {cart?.getCartItems.cartItems.length}
            </div>
          )}
          {header_icons.cartIcon}
        </Link>
      </div>
    </header>
  )
}
