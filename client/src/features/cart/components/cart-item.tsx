import { Heart, Trash2, Truck } from 'lucide-react'
import { useMutation } from '@apollo/client'
import { GET_CART_ITEMS, REMOVE_CART_ITEM } from '@/features/cart/api/cart'
import { cn } from '@/shared/utils/cn'
import type { CartItemType } from '../types'
import { Link } from '@tanstack/react-router'
import { Select } from '@/shared/components/ui/select'
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
}: CartItemType) {
  const [removeCartItem, { loading }] = useMutation(REMOVE_CART_ITEM, {
    refetchQueries: [GET_CART_ITEMS],
    awaitRefetchQueries: true,
  })

  const safeStock = Number(stock) || 1
  const maxQty = Math.min(Math.max(safeStock, 1), 10)
  const qtys = Array.from({ length: maxQty }).map((_, quantity) => ({
    value: String(quantity + 1),
    label: String(quantity + 1),
  }))

  const handleChange = (value: string) => {
    console.log('Selected:', value)
  }

  const primaryImage = images?.[0]?.image_url
  // const sellerName = brand_name || 'noon market'
  const itemPrice = Number(final_price ?? price ?? 0)
  const originalPrice = Number(price ?? 0)
  const hasDiscount = Boolean(discount_percentage && discount_percentage > 0)

  return (
    <article
      className={cn(
        'flex w-full flex-col gap-4 rounded-2xl border border-[#EAECF0] bg-white p-4 shadow-sm sm:p-5 lg:flex-row lg:gap-6',
        loading && 'opacity-60',
      )}>
      <Link
        to="/$title/$productId"
        params={{ productId: product_id, title: name }}
        className="flex h-32 w-full items-center justify-center overflow-hidden rounded-xl bg-[#f7f7fa] sm:h-36 sm:w-36 lg:w-40">
        {primaryImage ? (
          <Image
            src={primaryImage}
            alt={name}
            loading="lazy"
            layout="constrained"
            draggable={false}
            width={160}
            height={160}
            className="h-full w-full select-none object-contain"
          />
        ) : (
          <div className="text-sm text-[#7e859b]">No image</div>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-4">
        <div className="space-y-2">
          <h2 className="text-base font-semibold text-[#20232a] leading-snug sm:text-lg">{name}</h2>
          <div className="flex flex-wrap items-center gap-3 text-xs text-[#6f7285]">
            <span>Order in 14 h 45 m</span>
            <span className="flex items-center gap-1 font-semibold text-[#38ae04]">
              <Truck size={16} className="text-[#38ae04]" />
              Free Delivery
            </span>
            {/* <span>
              Sold by <strong className="font-semibold text-[#20232a]">{sellerName}</strong>
            </span> */}
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-2xl border border-dashed border-[#EAECF0] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-3 text-sm text-[#6f7285]">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-[#20232a]">Qty</span>
              <Select options={qtys} defaultValue="1" onChange={handleChange} className="w-[72px] justify-center" />
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={async () => {
                  await removeCartItem({ variables: { product_id } })
                }}
                className="flex items-center gap-2 rounded-full border border-[#E1E4ED] px-3 py-2 text-xs font-medium text-[#404553] transition-colors hover:border-[#c3c8db]">
                <Trash2 size={16} />
                Remove
              </button>
              <button
                type="button"
                className="flex items-center gap-2 rounded-full border border-[#E1E4ED] px-3 py-2 text-xs font-medium text-[#404553] transition-colors hover:border-[#c3c8db]">
                <Heart size={16} />
                Move to Wishlist
              </button>
            </div>
          </div>

          <div className="flex flex-col items-start gap-1 text-[#20232a] sm:items-end">
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-medium text-[#7e859b]">{currency}</span>
              <span className="text-2xl font-semibold">{itemPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            {hasDiscount ? (
              <div className="flex items-center gap-2 text-xs">
                <span className="text-[#7e859b] line-through">
                  {currency} {originalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="font-semibold text-[#38ae04]">{discount_percentage}% OFF</span>
              </div>
            ) : (
              <span className="text-xs text-[#7e859b]">Inclusive of VAT</span>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
