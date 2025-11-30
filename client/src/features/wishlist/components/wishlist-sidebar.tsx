import type { WishlistType } from '../types'
import { WishlistButton } from './wishlist-button'

export function WishlistSidebar({ wishlists }: { wishlists: WishlistType[] }) {
  return (
    <aside className="flex h-full flex-[0_0_30%] border-[#EAECF0] border-r p-[20px]">
      <ul className="w-full space-y-3">


        {wishlists.map((wishlist) => (
          <li key={wishlist.id}>
            <WishlistButton {...wishlist} />
          </li>
        ))}
      </ul>
    </aside>
  )
}
