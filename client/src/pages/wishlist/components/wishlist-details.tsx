import { Product } from '@/components/product/product'
import { Separator } from '@/components/ui/separator'

export function WishlistDetails() {
  return (
    <section className="w-full flex-auto">
      <header className="p-[20px]">
        <p className="flex items-center gap-1">
          <span className="px-[7px] text-start font-bold text-[22px]">defualt</span>
          <span className="rounded-[14px] bg-[#3866df] px-[10px] py-[2px] font-bold text-[12px] text-white">
            Defualt
          </span>
        </p>
      </header>
      <Separator />

      <div className="m-5 w-full">
        <div className="grid grid-cols-[repeat(4,minmax(0,calc(25%-15px)))] gap-[20px] ">
          <Product
            id="123"
            name="Apple iPhone 16 Pro Max 256GB Desert Titanium 5G With FaceTime - International Version "
            price={1200}
            currency="USD"
            isWishlistProduct
            images={[
              {
                image_url:
                  'https://f.nooncdn.com/p/pnsku/N70106183V/45/_/1726043631/3064c465-3457-42ef-a234-0b6382365281.jpg?width=800',
                is_primary: true,
              },
            ]}
          />
          <Product
            id="123"
            name="Apple iPhone 16 Pro Max 256GB Desert Titanium 5G With FaceTime - International Version "
            price={1200}
            currency="USD"
            isWishlistProduct
            images={[
              {
                image_url:
                  'https://f.nooncdn.com/p/pnsku/N70106183V/45/_/1726043631/3064c465-3457-42ef-a234-0b6382365281.jpg?width=800',
                is_primary: true,
              },
            ]}
          />
        </div>
      </div>
    </section>
  )
}
