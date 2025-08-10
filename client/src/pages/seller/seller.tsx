import { Separator } from '@/components/ui/separator'
import { SellerBanner } from './components/seller-banner'
import { SellerInformation } from './components/seller-information'
import { SellerPicture } from './components/seller-picture'
import { SellerRatings } from './components/seller-ratings'

export function SellerPage() {
  return (
    <main className="site-container ">
      <SellerBanner />
      <section className="flex items-start bg-white">
        <section className="relative w-[520px] p-[55px_36px_16px]">
          <SellerPicture />
          <SellerInformation />
        </section>
        <Separator className="mx-4 h-[1000px] w-[1px]" />
        <SellerRatings />
      </section>
    </main>
  )
}
