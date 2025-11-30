import { WishlistDetails } from '@/features/wishlist/components/wishlist-details'
import { WishlistSidebar } from '@/features/wishlist/components/wishlist-sidebar'
import { useQuery } from '@apollo/client'
import { GET_WISHLISTS } from '@/features/wishlist/api/wishlist'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import type { WishlistResponse, WishlistType } from './types'
import { Heart } from 'lucide-react'

export function WishlistPage() {
  const navigate = useNavigate({ from: '/wishlist' })
  const { wishlistCode } = useSearch({ from: '/(main)/_homeLayout/wishlist/' })
  const { data, loading } = useQuery<WishlistResponse<'getWishlists', WishlistType[]>>(GET_WISHLISTS)
  const wishlists = useMemo(() => data?.getWishlists.data || [], [data])
  const [selectedWishlist, setSelectedWishlist] = useState<WishlistType | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    if (loading) return
    if (!wishlists.length) return
    const currentExists = wishlistCode && wishlists.some((w) => w.id === wishlistCode)
    if (!currentExists) {
      navigate({ search: { wishlistCode: wishlists[0]?.id }, replace: true })
    } else {
      setSelectedWishlist(wishlists.find((w) => w.id === wishlistCode) || null)
    }
  }, [loading, navigate, wishlists, wishlistCode])

  return (
    <main className="site-container mt-4 sm:mt-8 min-h-screen w-full px-3 sm:px-6 lg:px-[45px] py-4">
      <section className="rounded-2xl border border-[#EAECF0] bg-white p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-[#3866df] text-sm font-semibold uppercase">
              <Heart size={16} /> Saved Lists
            </div>
            <h1 className="text-2xl font-extrabold text-[#1f2024]">My Wishlist</h1>
            <p className="text-sm text-gray-500">{wishlists.length || 0} saved list{wishlists.length === 1 ? '' : 's'}</p>
          </div>
          <button
            type="button"
            className="lg:hidden inline-flex items-center justify-center rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-[#404553] shadow-sm hover:bg-gray-50"
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            aria-expanded={isSidebarOpen}
          >
            {isSidebarOpen ? 'Hide Lists' : 'Show Lists'}
          </button>
        </div>

        <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-start">
          {/* Sidebar */}
          <div className={`${isSidebarOpen ? 'block' : 'hidden lg:block'} lg:w-80 xl:w-96 flex-shrink-0`}>
            <div className="lg:sticky lg:top-24">
              {loading ? (
                <div className="rounded-2xl border border-[#EAECF0] bg-white p-4 shadow-sm">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="mb-4 h-[90px] w-full rounded-md last:mb-0" />
                  ))}
                </div>
              ) : (
                <WishlistSidebar wishlists={wishlists} />
              )}
            </div>
          </div>

          {/* Wishlist Details */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="space-y-4 rounded-2xl border border-[#EAECF0] bg-white p-4 shadow-sm">
                <Skeleton className="h-[30px] w-1/3" />
                <Skeleton className="h-[150px] w-full rounded-md" />
                <Skeleton className="h-[150px] w-full rounded-md" />
              </div>
            ) : selectedWishlist ? (
              <WishlistDetails wishlists={wishlists} />
            ) : (
              <div className="rounded-2xl border border-dashed border-[#EAECF0] bg-white px-6 py-10 text-center">
                <p className="text-gray-500 text-sm sm:text-base">Select a wishlist to view details</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
