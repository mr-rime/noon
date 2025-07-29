import { Heart, Trash2, Truck } from 'lucide-react'
import { useMutation } from '@apollo/client'
import { REMOVE_CART_ITEM } from '@/graphql/cart'
import { cn } from '@/utils/cn'
import type { CartItem } from '../types'
import { Link } from '@tanstack/react-router'
import { Select } from '@/components/ui/select'
import { Image } from '@unpic/react'

export function CartItem({
  product_id,
  name,
  images,
  price,
  currency,
  final_price,
  discount_percentage,
  stock,
  refetchCartItems,
}: CartItem & { refetchCartItems: () => Promise<any> }) {
  const [removeCartItem, { loading }] = useMutation(REMOVE_CART_ITEM)

  const qtys = Array.from({ length: Number(stock) }).map((_, quantity) => ({
    value: String(quantity + 1),
    label: String(quantity + 1),
  }))

  const handleChange = (value: string) => {
    console.log('Selected:', value)
  }

  return (
    <div className={cn('flex h-fit w-full items-start rounded-[6px] bg-white p-[15px]', loading && 'opacity-50')}>
      <Link to="/$title/$productId" params={{ productId: product_id, title: name }} className="mr-2 h-[200px] w-fit">
        <Image
          src={images?.[0].image_url}
          alt="product-img"
          loading="lazy"
          layout="constrained"
          width={150}
          height={150}
          className="h-full w-fit"
        />
      </Link>

      <div className="mt-2 mr-16">
        <div className="">
          <h2 className="w-[400px] truncate whitespace-break-spaces font-semibold text-[14px] leading-[16px]">
            {name}
          </h2>
        </div>
        <div className="mt-3 h-[70px]">
          <span className="text-[#7c87a8] text-[12px]">Order in 14 h 45 m</span>
          <div className="font-bold text-[12px]">
            Get it by <span className="font-bold text-[#38ae04] ">Sat, Jun 14</span>
          </div>
          <div className="mt-2 text-[14px]">
            <span className="text-[#7e859b]">Sold by</span> <strong>iQ</strong>
          </div>
        </div>

        <div className="mt-5 flex h-[30px] items-center space-x-2">
          <button
            onClick={async () => {
              await removeCartItem({ variables: { product_id } })
              await refetchCartItems()
            }}
            className="flex cursor-pointer items-center space-x-1 rounded-[8px] border border-[#dadce3] p-[8px]">
            <Trash2 size={18} color="#7e859b" />
            <span className="text-[#7e859b] text-[12px]">Remove</span>
          </button>
          <button className="flex cursor-pointer items-center space-x-1 rounded-[8px] border border-[#dadce3] p-[8px]">
            <Heart size={18} color="#7e859b" />
            <span className="text-[#7e859b] text-[12px]">Move to Wishlist</span>
          </button>
        </div>
      </div>

      <div className="flex w-[150px] flex-col items-center">
        <div className="flex h-[50px] flex-col items-center">
          <div className="flex items-center space-x-1 text-black ">
            <span className="text-[14px]">{currency}</span>
            <b className="text-[22px]">{final_price}</b>
          </div>
          <div className="w-full space-x-1 text-end text-[11px]">
            <span className="text-[#7e859b] line-through">{price}</span>
            <span className="font-bold text-[#38ae04] uppercase">{discount_percentage}% Off</span>
          </div>
        </div>
        <div className="mt-3 flex h-[50px] flex-col items-end">
          {/* <div className=" w-[70px] h-[70px] ">
                        <img src="/media/svgs/marketplace-v2-en.svg" alt="marketplace-badge" className="w-full h-full" />
                    </div> */}
          <div className="flex items-center space-x-2">
            <Truck color="#376FE0" size={20} />
            <span className="font-medium text-[12px]">Free Delivery</span>
          </div>
        </div>

        <div className=" flex items-center space-x-4">
          <span className="text-[#7e859b] text-[14px] ">Qty</span>
          <Select options={qtys} defaultValue="1" onChange={handleChange} className="w-[60px] rounded-[8px] p-[8px]" />
        </div>
      </div>
    </div>
  )
}
