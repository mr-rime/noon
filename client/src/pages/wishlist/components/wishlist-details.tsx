import { Product } from '@/components/product/product'
import type { WishlistResponse, WishlistType } from '../types'
import { useQuery } from '@apollo/client'
import { GET_WISHLIST_ITEMS } from '@/graphql/wishlist'
import { useSearch } from '@tanstack/react-router'
import { ProductSkeleton } from '@/components/product/components'

import { Ellipsis, ShieldCheck, Users } from 'lucide-react'
import { Image } from '@unpic/react'
import { Dropdown } from '@/components/ui/dropdown'
import { EditButttonWithModal } from './edit-buttton-with-modal'
import { DeleteButtonWithModal } from './delete-button-with-modal'
import { useMemo } from 'react'
import { MakeDefaultWishlistButton } from './make-default-wishlist-button'
import { EmptyWishlistButton } from './empty-wishlist-button'
import { ShareWishlistButtonWithModal } from './share-wishlist-button-with-modal'
import { TogglePublicSharingButton } from './toggle-public-sharing-button'


export function WishlistDetails({ wishlists }: { wishlists: WishlistType[] }) {
  const { wishlistCode } = useSearch({ from: '/(main)/_homeLayout/wishlist/' })
  const { data, loading } = useQuery<WishlistResponse<'getWishlistItems', WishlistType[]>>(GET_WISHLIST_ITEMS, {
    variables: { wishlist_id: wishlistCode },
    fetchPolicy: 'network-only',
  })
  const currentWishlist = useMemo(() => wishlists.find((w) => w.id === wishlistCode), [wishlistCode, wishlists])


  const itemCount = currentWishlist?.item_count || 0
  const isPrivate = currentWishlist?.is_private

  return (
    <section className="w-full flex-auto">
      <div className="rounded-2xl border border-[#EAECF0] bg-white shadow-sm">
        <header className="flex flex-col gap-4 border-b border-[#F0F2F5] p-4 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-2xl font-bold text-[#1f2024]">{currentWishlist?.name || 'Wishlist'}</h2>
              {currentWishlist?.is_default && (
                <span className="rounded-full bg-[#3866df] px-3 py-1 text-xs font-semibold uppercase text-white">
                  Default
                </span>
              )}
              <span className="rounded-full bg-[#F4F7FF] px-3 py-1 text-xs font-semibold text-[#3866df]">
                {itemCount} item{itemCount === 1 ? '' : 's'}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase text-[#374151]">
              {isPrivate ? (
                <span className="flex items-center gap-1 rounded-full bg-[#FDF2F8] px-3 py-1 text-[#C11574]">
                  <ShieldCheck size={14} /> Private list
                </span>
              ) : (
                <span className="flex items-center gap-1 rounded-full bg-[#F0FDF4] px-3 py-1 text-[#027A48]">
                  <Users size={14} /> Shared list
                </span>
              )}
              <span className="text-[11px] normal-case text-[#6B7280]">
                Updated {currentWishlist?.created_at ? new Date(currentWishlist.created_at).toLocaleDateString() : 'recently'}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <ShareWishlistButtonWithModal currentWishlist={currentWishlist} />
            <Dropdown
              align="center"
              trigger={
                <button className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-[#dfe4f2] px-6 py-2 text-sm font-semibold text-[#1f2024] transition-colors hover:border-[#3866df] hover:text-[#3866df] sm:w-auto">
                  <Ellipsis size={16} /> More
                </button>
              }>
              <EditButttonWithModal wishlist={currentWishlist} />
              {!currentWishlist?.is_default && <MakeDefaultWishlistButton currentWishlist={currentWishlist} />}
              <TogglePublicSharingButton currentWishlist={currentWishlist} />
              <EmptyWishlistButton currentWishlist={currentWishlist} />
              {!currentWishlist?.is_default && (
                <DeleteButtonWithModal wishlists={wishlists} currentWishlist={currentWishlist} />
              )}
            </Dropdown>
          </div>
        </header>

        <div className="p-4 sm:p-6">
          {itemCount <= 0 ? (
            <div className="flex h-full w-full flex-col items-center justify-center text-center ">
              <Image
                src="/media/gifs/wishlist-empty-desktop-fallback.gif"
                alt="empty wishlist fallback"
                width={320}
                height={320}
                className="select-none rounded-xl mb-2"
                layout="constrained"
              />
              <div className="max-w-md space-y-2">
                <h3 className="text-xl font-semibold text-[#1f2024]">Ready to make a wish?</h3>
                <p className="text-sm text-[#7e859b]">
                  Start adding items you love to your wishlist by tapping on the heart icon when browsing products.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3">
              {loading ? (
                Array.from({ length: 4 }).map((_, idx) => <ProductSkeleton key={idx} />)
              ) : (
                data?.getWishlistItems.data.map((item) => (
                  <Product
                    key={item.id}
                    isWishlistProduct
                    className="w-full max-w-full "
                    {...item}
                    user_id={parseInt(item.user_id)}
                  />
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
