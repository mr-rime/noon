import { Product } from '@/components/product/product'
import { Separator } from '@/components/ui/separator'
import type { WishlistResponse, WishlistType } from '../types'
import { useQuery } from '@apollo/client'
import { GET_WISHLIST_ITEMS } from '@/graphql/wishlist'
import { useSearch } from '@tanstack/react-router'
import { ProductSkeleton } from '@/components/product/components'
import { wishlist_icons } from '../constants'
import { Ellipsis } from 'lucide-react'
import { Image } from '@unpic/react'
import { Dropdown } from '@/components/ui/dropdown'
import { EditButttonWithModal } from './edit-buttton-with-modal'
import { DeleteButtonWithModal } from './delete-button-with-modal'
import { useMemo } from 'react'
import { MakeDefaultWishlistButton } from './make-default-wishlist-button'
import { EmptyWishlistButton } from './empty-wishlist-button'

export function WishlistDetails({ wishlists }: { wishlists: WishlistType[] }) {
  const { wishlistCode } = useSearch({ from: '/(main)/_homeLayout/wishlist/' })

  const { data, loading } = useQuery<WishlistResponse<'getWishlistItems', WishlistType[]>>(GET_WISHLIST_ITEMS, {
    variables: { wishlist_id: wishlistCode },
  })


  const currentWishlist = useMemo(() => wishlists.find((w) => w.id === wishlistCode), [wishlistCode, wishlists])

  return (
    <section className="w-full flex-auto">
      <header className="flex items-center justify-between p-[20px]">
        <p className="flex items-center gap-1">
          <span className="px-[7px] text-start font-bold text-[22px]">{currentWishlist?.name}</span>
          {currentWishlist?.is_default && (
            <span className="rounded-[14px] bg-[#3866df] px-[10px] py-[2px] font-bold text-[12px] text-white">
              Default
            </span>
          )}
        </p>

        <div className="flex items-center gap-4">
          <button className="flex cursor-pointer items-center gap-3 rounded-full border border-[#ebecf0] px-[30px] py-[6px]">
            <span>{wishlist_icons.shareIcon}</span>
            <span className="font-bold text-[14px]">Share</span>
          </button>
          <Dropdown
            align="center"
            trigger={
              <button className="flex cursor-pointer items-center gap-2 rounded-full border border-[#ebecf0] px-[30px] py-[6px]">
                <span>
                  <Ellipsis />
                </span>
                <span className="font-bold text-[14px]">More</span>
              </button>
            }>
            <EditButttonWithModal wishlist={currentWishlist} />
            {!currentWishlist?.is_default && <MakeDefaultWishlistButton currentWishlist={currentWishlist} />}
            <EmptyWishlistButton currentWishlist={currentWishlist} />
            {!currentWishlist?.is_default && (
              <DeleteButtonWithModal wishlists={wishlists} currentWishlist={currentWishlist} />
            )}
          </Dropdown>
        </div>
      </header>
      <Separator />

      <div className="m-5 w-full">
        {(currentWishlist?.item_count || 0) <= 0 ? (
          <div className="flex h-full w-full flex-col items-center justify-center">
            <Image
              src="/media/gifs/wishlist-empty-desktop-fallback.gif"
              alt="empty wishlist fallback"
              width={400}
              height={400}
              className={'select-none'}
              layout="constrained"
            />
            <div className="text-center">
              <h3 className="font-bold text-[22px]">Ready to make a wish?</h3>
              <p className="text-[#7e859b] text-[14px]">
                Start adding items you love to your wishlist by tapping on the heart icon
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(4,minmax(0,calc(25%-15px)))] gap-[20px] ">
            {loading ? (
              <>
                <ProductSkeleton />
                <ProductSkeleton />
                <ProductSkeleton />
              </>
            ) : (
              data?.getWishlistItems.data.map((item) => (
                <Product
                  key={item.id}
                  isWishlistProduct
                  {...item}
                  user_id={parseInt(item.user_id)}
                />
              ))
            )}
          </div>
        )}
      </div>
    </section>
  )
}
