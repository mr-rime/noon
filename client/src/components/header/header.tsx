import { useQuery } from '@apollo/client'
import { Link, useLocation, useNavigate } from '@tanstack/react-router'
import Cookies from 'js-cookie'
import { useEffect, useMemo, useState } from 'react'
import { Separator } from '../ui/separator'
import { Skeleton } from '../ui/skeleton'
import { MobileBottomNav, MobileCategoryDrawer, SearchInput, UserMenu } from './components'
import { header_icons } from './constants/icons'
import { GET_CART_ITEMS } from '@/graphql/cart'
import { matchesExpectedRoute } from '@/utils/matchesExpectedRoute'
import type { GetUserResponse } from '@/types'
import { GET_USER } from '@/graphql/user'
import { LoginButtonWithModalDialog } from '../login-modal'
import type { CartResponseType } from '@/pages/cart'
import { WishlistLink } from './components/wishlist-link'
import useUserHashStore from '@/store/user-hash/user-hash'
import { useIsMobile } from '@/hooks/use-mobile'

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
  const hash = useUserHashStore((state) => state.hash)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { data, loading } = useQuery<GetUserResponse>(GET_USER, {
    variables: { hash: Cookies.get('hash') || hash || '' },
  })

  const { data: cart } = useQuery<CartResponseType>(GET_CART_ITEMS)

  const { pathname } = useLocation()
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const user = useMemo(() => data?.getUser.user, [data?.getUser.user])
  const isLoading = useMemo(() => loading, [loading])
  const cartCount = cart?.getCartItems.cartItems?.length ?? 0
  const isOnAccountRoutes = matchesExpectedRoute(pathname, expectedRoutes)
  const showMobileBottomNav = isMobile && !isOnAccountRoutes

  const memoizedSearchInput = useMemo(() => <SearchInput />, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <header
        className={
          'sticky top-0 z-30 flex w-full items-center justify-center bg-[#FEEE00] shadow-sm transition-shadow ' +
          (isScrolled ? 'shadow-md' : '')
        }>
        <div className="site-container flex h-[64px] w-full items-center justify-between px-3 sm:px-4 lg:px-6 xl:px-8">
          <div className="flex items-center gap-2 sm:gap-4 lg:gap-6">
            <Link to="/" className="text-[20px] sm:text-[24px] lg:text-[28px] font-bold whitespace-nowrap min-w-[60px]">
              noon
            </Link>
          </div>

          <div className="hidden lg:flex flex-1 justify-center">
            <div className="w-full max-w-2xl xl:max-w-3xl">{memoizedSearchInput}</div>
          </div>

          <div className="hidden lg:flex items-center gap-3 xl:gap-4">
            {loading ? (
              <Skeleton className="h-[20px] w-[160px] rounded-[2px] bg-[#d4d4d46b]" />
            ) : isOnAccountRoutes ? (
              <button className="cursor-pointer" onClick={() => navigate({ to: '/' })}>
                {header_icons.homeIcon}
              </button>
            ) : user ? (
              <UserMenu user={user} loading={isLoading} />
            ) : (
              <LoginButtonWithModalDialog />
            )}

            <Separator className="mx-2 lg:mx-3 h-[20px] w-[1px] bg-[#404553] opacity-[0.2]" />

            {!isOnAccountRoutes && (
              <>
                {user ? (
                  <WishlistLink />
                ) : (
                  <LoginButtonWithModalDialog>
                    {({ open, isOpen }) => (
                      <button
                        className="relative mr-3 h-fit w-fit cursor-pointer text-[#404553] transition-colors hover:text-[#8C8832]"
                        onClick={open}
                        aria-expanded={isOpen}
                        aria-label="Open wishlist"
                      >
                        {header_icons.heartIcon}
                      </button>

                    )}
                  </LoginButtonWithModalDialog>
                )}
              </>
            )}
            <Link
              to="/cart"
              preload="render"
              aria-label="Shopping cart"
              className="relative mx-1 text-[#404553] transition-colors hover:text-[#8C8832]"
            >
              {cartCount > 0 && (
                <div className="-right-[8px] -top-2 absolute flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#3866DF] font-semibold text-[10px] text-white">
                  {cartCount}
                </div>
              )}
              {header_icons.cartIcon}
            </Link>

          </div>

          <button
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors ml-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {isMobileMenuOpen && (
          <div data-mobile-menu="true" className="lg:hidden absolute top-[64px] left-0 right-0 z-50 border-t border-gray-200 bg-white shadow-lg">
            <div className="site-container relative space-y-4 px-4 py-4 max-h-[70vh] overflow-y-auto">
              <div className="rounded-md border border-gray-200 p-2 shadow-sm">
                {memoizedSearchInput}
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm text-[#404553]">
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  {loading ? (
                    <Skeleton className="h-[20px] w-[100px] rounded-[2px] bg-[#d4d4d46b]" />
                  ) : isOnAccountRoutes ? (
                    <button className="cursor-pointer" onClick={() => {
                      navigate({ to: '/' })
                      setIsMobileMenuOpen(false)
                    }}>
                      {header_icons.homeIcon}
                    </button>
                  ) : user ? (
                    // user menu trigger moved to bottom-right; keep placeholder/greeting here
                    <div className="font-medium text-sm text-[#1f2024]">Hello {user.first_name}</div>
                  ) : (
                    <LoginButtonWithModalDialog />
                  )}
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {!isOnAccountRoutes && (
                      <>
                        {user ? (
                          <WishlistLink />
                        ) : (
                          <LoginButtonWithModalDialog>
                            {({ open, isOpen }) => (
                              <button
                                className="relative h-fit w-fit cursor-pointer text-[#404553] transition-colors hover:text-[#8C8832]"
                                onClick={open}
                                aria-expanded={isOpen}>
                                {header_icons.heartIcon}
                              </button>
                            )}
                          </LoginButtonWithModalDialog>
                        )}
                      </>
                    )}
                  </div>
                  {/* cart link intentionally omitted in mobile menu */}
                </div>
              </div>
              {/* user menu trigger anchored to bottom-right of the mobile drawer */}
              {user && (
                <div className="absolute right-4 bottom-4 z-50">
                  <UserMenu user={user} loading={isLoading} />
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      <MobileBottomNav
        cartCount={cartCount}
        isVisible={showMobileBottomNav}
        user={user}
        onCategoriesClick={() => {
          setIsCategoryDrawerOpen(true)
          setIsMobileMenuOpen(false)
        }}
      />

      <MobileCategoryDrawer open={isCategoryDrawerOpen} onOpenChange={setIsCategoryDrawerOpen} />
    </>
  )
}
