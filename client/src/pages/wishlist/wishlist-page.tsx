import { Separator } from '@/components/ui/separator'
import { CreateWishlistButtonWithModal } from './components/create-wishlist-button-with-modal'
import { WishlistDetails } from './components/wishlist-details'
import { WishlistSidebar } from './components/wishlist-sidebar'

export function WishlistPage() {
  return (
    <main className="site-container mt-10 min-h-screen w-full px-[45px] py-2">
      <header className="flex w-full items-center justify-between">
        <h2 className="font-bold text-[24px]">Wishlist</h2>
        <CreateWishlistButtonWithModal />
      </header>
      <Separator className="mt-5" />
      <section className="flex items-start">
        <WishlistSidebar />
        <WishlistDetails />
      </section>
    </main>
  )
}
