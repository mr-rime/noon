import { Product } from '@/components/product/product'
import { Separator } from '@/components/ui/separator'
import type { WishlistItemsResponseType, WishlistType } from '../types'
import { useQuery } from '@apollo/client'
import { GET_WISHLIST_ITEMS } from '@/graphql/wishlist'
import { useSearch } from '@tanstack/react-router'
import { ProductSkeleton } from '@/components/product/components'

export function WishlistDetails({ wishlists }: { wishlists: WishlistType[] }) {
  const { wishlistCode } = useSearch({ from: '/(main)/_homeLayout/wishlist/' })
  const { data, loading } = useQuery<WishlistItemsResponseType>(GET_WISHLIST_ITEMS, {
    variables: { wishlist_id: wishlistCode },
  })
  const currentWishlist = wishlists.find((wishlist) => wishlist.id === wishlistCode)

  return (
    <section className="w-full flex-auto">
      <header className="p-[20px]">
        <p className="flex items-center gap-1">
          <span className="px-[7px] text-start font-bold text-[22px]">{currentWishlist?.name}</span>
          {currentWishlist?.is_default && (
            <span className="rounded-[14px] bg-[#3866df] px-[10px] py-[2px] font-bold text-[12px] text-white">
              Defualt
            </span>
          )}
        </p>
      </header>
      <Separator />

      <div className="m-5 w-full">
        <div className="grid grid-cols-[repeat(4,minmax(0,calc(25%-15px)))] gap-[20px] ">
          {loading ? (
            <>
              <ProductSkeleton />
              <ProductSkeleton />
              <ProductSkeleton />
            </>
          ) : (
            data?.getWishlistItems.data.map((item) => <Product key={item.id} isWishlistProduct {...item} />)
          )}
        </div>
      </div>
    </section>
  )
}
