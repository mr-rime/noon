import { Separator } from '@/components/ui/separator'
import { CreateWishlistButtonWithModal } from './components/create-wishlist-button-with-modal'
import { WishlistDetails } from './components/wishlist-details'
import { WishlistSidebar } from './components/wishlist-sidebar'
import { useQuery } from '@apollo/client'
import { GET_WISHLISTS } from '@/graphql/wishlist'
import { Skeleton } from '@/components/ui/skeleton'
import { useEffect, useMemo } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import type { WishlistResponse, WishlistType } from './types'

export function WishlistPage() {
  const navigate = useNavigate({ from: '/wishlist' })
  const { wishlistCode } = useSearch({ from: '/(main)/_homeLayout/wishlist/' })
  const { data, loading } = useQuery<WishlistResponse<'getWishlists', WishlistType[]>>(GET_WISHLISTS)
  const wishlists = useMemo(() => data?.getWishlists.data || [], [data])

  useEffect(() => {
    if (loading) return
    if (!wishlists.length) return
    const currentExists = wishlistCode && wishlists.some((w) => w.id === wishlistCode)
    if (!currentExists) {
      navigate({ search: { wishlistCode: wishlists[0]?.id }, replace: true })
    }
  }, [loading, navigate, wishlists, wishlistCode])

  return (
    <main className="site-container mt-10 min-h-screen w-full px-[45px] py-2">
      <header className="flex w-full items-center justify-between">
        {loading ? <Skeleton className="h-[32px] w-[150px]" /> : <h2 className="font-bold text-[24px]">Wishlist</h2>}

        {loading ? <Skeleton className="h-[40px] w-[180px] rounded-md" /> : <CreateWishlistButtonWithModal />}
      </header>

      <Separator className="mt-5" />

      <section className="mt-4 flex items-start gap-4">
        {loading ? (
          <div className="flex h-[400px] flex-[0_0_30%] flex-col space-y-4 border-[#EAECF0] border-r p-[20px]">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-[90px] w-full rounded-md" />
            ))}
          </div>
        ) : (
          <WishlistSidebar wishlists={wishlists} />
        )}

        {loading ? (
          <div className="flex-1 space-y-4 p-4">
            <Skeleton className="h-[30px] w-1/3" />
            <Skeleton className="h-[150px] w-full rounded-md" />
            <Skeleton className="h-[150px] w-full rounded-md" />
          </div>
        ) : (
          <WishlistDetails wishlists={wishlists} />
        )}
      </section>
    </main>
  )
}
