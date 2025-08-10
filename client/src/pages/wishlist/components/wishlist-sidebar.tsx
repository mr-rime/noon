import type { WishlistType } from '../types'
import { WishlistButton } from './wishlist-button'

export function WishlistSidebar({ wishlists }: { wishlists: WishlistType[] }) {
  return (
    <aside className="flex h-full flex-[0_0_30%] border-[#EAECF0] border-r p-[20px]">
      <ul className="w-full space-y-3">
        {/* <li>
          <button className="w-full cursor-pointer bg-[#ebecf0] p-[20px]">
            <p className="flex items-center gap-1">
              <span className="px-[7px] text-start font-bold text-[16px]">defualt</span>
              <span className="rounded-[14px] bg-[#3866df] px-[10px] py-[2px] font-bold text-[12px] text-white">
                Defualt
              </span>
            </p>
            <p className="mt-3 flex items-center gap-2">
              <span className="text-[14px]">2 items </span>
              <span>{wishlist_icons.wishlistPublicIcon}</span>
            </p>
          </button>
        </li> */}

        {wishlists.map((wishlist) => (
          <li key={wishlist.id}>
            <WishlistButton {...wishlist} />
          </li>
        ))}
      </ul>
    </aside>
  )
}
