import { Link } from '@tanstack/react-router'
import type { ProductType } from '@/types'
import { ProdcutPrice } from './components/prodcut-price'
import { ProductBadge } from './components/product-badge'
import { ProductImage } from './components/product-image'
import { ProductTitle } from './components/product-title'
import { Ellipsis, Star } from 'lucide-react'
import { Button } from '../ui/button'
import { cn } from '@/utils/cn'
import { useMutation, useQuery } from '@apollo/client'
import { ADD_CART_ITEM, GET_CART_ITEMS } from '@/graphql/cart'
import type { CartResponseType } from '../cart-page/types'
import { toast } from 'sonner'

export function Product({
  id,
  name,
  images,
  currency,
  price,
  discount_percentage,
  final_price,
  isWishlistProduct = false,
}: ProductType & { isWishlistProduct?: boolean }) {
  const [addCartItem, { loading }] = useMutation(ADD_CART_ITEM)
  const { refetch } = useQuery<CartResponseType>(GET_CART_ITEMS)
  return (
    <article
      className={cn(
        'h-[467px] w-full max-w-[230px] select-none overflow-x-hidden rounded-[12px] border border-[#DDDDDD] bg-white p-2',
        isWishlistProduct && 'h-fit',
      )}>
      <Link
        to="/$title/$productId"
        params={{ productId: id, title: name.replace(/\s+/g, '-') }}
        className="h-full w-full"
        preload="intent">
        <ProductImage images={images?.map((img) => img.image_url)} />
        <ProductTitle name={name} />
        <div className="my-2 flex w-fit items-center justify-center space-x-2 rounded-[6px] bg-[#f3f4f8] px-[6px] py-[4px]">
          <div className="flex items-center space-x-1">
            <Star fill="#008000" color="#008000" size={14} />
            <div className="font-semibold text-[13px]">4.6</div>
          </div>
          <div className="text-[#9ba0b1] text-[13px]">
            <span>(20.6K)</span>
          </div>
        </div>
        <ProdcutPrice
          price={price}
          currency={currency}
          final_price={final_price}
          discount_percentage={discount_percentage}
        />
        <ProductBadge />
      </Link>
      {isWishlistProduct && (
        <div className="mt-5 flex items-center gap-2">
          <Button
            onClick={async () => {
              const { data } = await addCartItem({ variables: { product_id: id, quantity: 1 } })
              if (data.addToCart.success) {
                await refetch()
              } else {
                toast.error('Failed to add product to cart. Please try again.')
              }
            }}
            className="h-[37px] w-[80%] text-[14px]">
            ADD TO CART
          </Button>
          <button className="flex h-[37px] w-[20%] cursor-pointer items-center justify-center rounded-[4px] border border-[#3866df] bg-transparent">
            <Ellipsis color="#3866df" size={20} />
          </button>
        </div>
      )}
    </article>
  )
}
