import { Link, useParams } from '@tanstack/react-router'
import { ChevronRight, Star } from 'lucide-react'
import { Separator } from '@/shared/components/ui/separator'
import { product_page_icon } from '../constants/icons'
import { Button } from '@/shared/components/ui/button'
import { useMutation } from '@apollo/client'
import { ADD_CART_ITEM, GET_CART_ITEMS } from '@/features/cart/api/cart'
import type { ProductType } from '@/shared/types'
import { toast } from 'sonner'
import { BouncingLoading } from '@/shared/components/ui/bouncing-loading'
import { Image } from '@unpic/react'
import { formatNumber } from '@/shared/utils/format-number'

type ProductPageDetailsProps = {
  theme?: 'mobile' | 'desktop'
  product?: ProductType
  quantity?: number
  onQuantityClick?: () => void
  onAddToCart?: () => Promise<void> | void
  onBuyNow?: () => Promise<void> | void
  addToCartLoading?: boolean
}

export function ProductPageDetails({
  theme = 'desktop',
  product,
  quantity = 1,
  onQuantityClick,
  onAddToCart,
  onBuyNow,
  addToCartLoading,
}: ProductPageDetailsProps) {
  const { productId } = useParams({ from: '/(main)/_homeLayout/$title/$productId/' })
  const [addCartItem, { loading }] = useMutation(ADD_CART_ITEM, {
    refetchQueries: [GET_CART_ITEMS],
    awaitRefetchQueries: true,
  })

  const handleInternalAddToCart = async () => {
    if (!productId) return
    const { data } = await addCartItem({ variables: { product_id: productId, quantity } })
    if (data.addToCart.success) {
      toast.success('Product added to cart successfully.')
    } else {
      toast.error('Failed to add product to cart. Please try again.')
    }
  }

  const handleAddToCartClick = async () => {
    if (onAddToCart) {
      await onAddToCart()
    } else {
      await handleInternalAddToCart()
    }
  }

  const handleBuyNowClick = async () => {
    if (onBuyNow) {
      await onBuyNow()
    } else {
      await handleInternalAddToCart()
    }
  }

  const resolvedLoading = addToCartLoading ?? loading
  const showEnhancedActions = Boolean(onAddToCart)
  const isOutOfStock = Number(product?.stock ?? 0) === 0

  return theme === 'desktop' ? (
    <div className="w-full rounded-[8px] border border-[#eceef4]">
      <div className="flex flex-col items-start justify-start space-x-4 px-4 py-3">
        <div className="flex items-center justify-start space-x-4 px-4 py-3">
          <Image
            src="/media/imgs/logo-eg.png"
            alt="logo"
            className="rounded-[8px]"
            width={40}
            height={40}
            layout="constrained"
          />
          <div>
            <Link to={'/seller/$sellerId'} params={{ sellerId: '1' }}>
              <div className="flex cursor-pointer items-center text-[14px] transition-colors hover:text-[#3866DF]">
                Sold by <strong className="ml-1">noon</strong> <ChevronRight size={20} />
              </div>
            </Link>
            <div className="flex items-center justify-start space-x-1">
              <Star fill="#008000" color="#008000" size={16} />{' '}
              <span className="font-bold text-[#008000] text-[14px]">{product?.rating?.toFixed(1) || '0.0'}</span>
            </div>
          </div>
        </div>

        <div className="grid w-full cursor-pointer grid-cols-2 gap-[8px]">
          <div className="flex h-[32px] w-full grid-cols-[span_2/span_2] flex-row flex-nowrap items-center justify-center gap-[6px] rounded-[6px] bg-[#f3f4f8] px-[8px] py-[4px] text-[14px]">
            <span className="text-ellipsis whitespace-nowrap text-[#404553]">Item as shown</span>
            <span className="text-ellipsis whitespace-nowrap break-keep font-bold text-[#38AE04]">90%</span>
          </div>
          <div className="flex h-[32px] grid-cols-[span_2/span_2] items-center justify-center gap-[6px] rounded-[6px] bg-[#f3f4f8] px-[8px] py-[4px] text-[14px]">
            <span className="text-ellipsis whitespace-nowrap text-[#404553]">Partner since</span>
            <span className="text-ellipsis whitespace-nowrap break-keep font-bold text-[#38AE04]">4+ Y</span>
          </div>

          <div className="flex h-[32px] grid-cols-[span_2/span_2] items-center justify-center gap-[6px] rounded-[6px] bg-[#f3f4f8] px-[8px] py-[4px] text-[14px]">
            <span className="text-ellipsis whitespace-nowrap text-[#404553]">Great recent rating</span>
          </div>
        </div>
      </div>
      <Separator className="my-5" />
      <div className="px-4 py-3">
        <ul className="space-y-3">
          <li className="flex cursor-pointer items-center space-x-2 text-[#7F7F7F] text-[14px] hover:text-[#3866DF] ">
            <div>{product_page_icon.lockerDeliveryIcon}</div>

            <span>Free delivery on Lockers</span>
          </li>

          <li className="flex cursor-pointer items-center space-x-2 text-[#7F7F7F] text-[14px] hover:text-[#3866DF] ">
            <div>{product_page_icon.returnableIcon}</div>
            <span>This item is eligible for fre returns</span>
          </li>

          <li className="flex cursor-pointer items-center space-x-2 text-[#7F7F7F] text-[14px] hover:text-[#3866DF] ">
            <div>{product_page_icon.securePaymentsIcon}</div>
            <span>Secure Payments</span>
          </li>
        </ul>
      </div>

      <Separator className="my-5" />

      <div className="px-4 py-3">
        {isOutOfStock ? (
          <Button
            disabled
            className="flex h-[52px] w-full cursor-default items-center justify-center rounded-[14px] bg-[#6079E1] font-bold text-[14px] text-white uppercase transition-colors hover:bg-[#6079E1]">
            Out of stock
          </Button>
        ) : showEnhancedActions ? (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <div className="flex flex-1 flex-col gap-3 sm:flex-row">
                <Button
                  type="button"
                  onClick={handleAddToCartClick}
                  disabled={resolvedLoading}
                  className="flex h-[52px] flex-1 items-center justify-center rounded-[12px] bg-[#2B4CD7] text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#1e36a5] disabled:cursor-not-allowed disabled:opacity-60">
                  {resolvedLoading ? <BouncingLoading /> : 'Add to cart'}
                </Button>
              </div>
            </div>
            <p className="text-xs text-[#7e859b]">Fast checkout • Secure payment</p>
          </div>
        ) : (
          <Button
            onClick={handleInternalAddToCart}
            className="flex h-[52px] w-full cursor-pointer items-center justify-center rounded-[14px] bg-[#2B4CD7] font-bold text-[14px] text-white uppercase transition-colors hover:bg-[#6079E1]">
            {loading ? <BouncingLoading /> : 'Add to cart'}
          </Button>
        )}
      </div>
    </div>
  ) : (
    <div className="flex w-full flex-col rounded-[8px] border border-[#f3f4f8] bg-white p-[10px] shadow-[0_2px_8px_0_rgba(0,0,0,.05)]">
      <button className="flex items-center gap-3">
        <Link
          className="flex w-full items-center justify-between gap-3"
          to={'/seller/$sellerId'}
          params={{ sellerId: '1' }}>
          <div className="flex items-center gap-3">
            <div className="flex h-[48px] w-[48px] items-center justify-center rounded-full bg-[#f3f4f8]">
              {product_page_icon.coloredSellerIcon}
            </div>
            <div>
              <div className="flex cursor-pointer items-center text-[12px] transition-colors hover:text-[#3866df]">
                Sold by <strong className="ml-1 text-[#3866df] text-[14px] underline">noon</strong>
              </div>
              <div className="mt-2 flex items-center gap-[8px]">
                <div className="flex h-[17px] w-fit items-center justify-center gap-[2px] rounded-full bg-[#38AE04] px-[4px] py-[2px] text-[14px] text-white">
                  <span>{product?.rating?.toFixed(1) || '0.0'}</span>
                  <Star fill="white" color="white" size={9} />
                </div>
                <div className="text-[12px]">{formatNumber(product?.review_count || 0)} Ratings</div>
              </div>
            </div>
          </div>
          <ChevronRight size={20} />
        </Link>
      </button>
      <Separator className="my-5" />
      {isOutOfStock ? (
        <Button
          disabled
          className="flex h-[52px] w-full cursor-default items-center justify-center rounded-[14px] bg-[#6079E1] font-bold text-[14px] text-white uppercase transition-colors hover:bg-[#6079E1]">
          Out of stock
        </Button>
      ) : showEnhancedActions ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-[10px] border border-[#DADCE3] px-4 py-2 text-sm font-semibold text-[#6f7285]">
            <span>Quantity</span>
            <button
              type="button"
              onClick={onQuantityClick}
              className="text-base font-bold text-[#20232a]"
              aria-label="Change quantity">
              {quantity}
            </button>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleAddToCartClick}
              disabled={resolvedLoading}
              className="flex h-[52px] flex-1 items-center justify-center rounded-[12px] bg-[#2B4CD7] text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#1e36a5] disabled:cursor-not-allowed disabled:opacity-60">
              {resolvedLoading ? <BouncingLoading /> : 'Add to cart'}
            </button>
            <button
              type="button"
              onClick={handleBuyNowClick}
              disabled={resolvedLoading}
              className="flex h-[52px] flex-1 items-center justify-center rounded-[12px] border border-[#2B4CD7] text-sm font-bold uppercase tracking-wide text-[#2B4CD7] transition-colors hover:bg-[#eef1ff] disabled:cursor-not-allowed disabled:opacity-60">
              Buy now
            </button>
          </div>
        </div>
      ) : (
        <Button
          onClick={handleInternalAddToCart}
          className="flex h-[52px] w-full cursor-pointer items-center justify-center rounded-[14px] bg-[#2B4CD7] font-bold text-[14px] text-white uppercase transition-colors hover:bg-[#6079E1]">
          {loading ? <BouncingLoading /> : 'Add to cart'}
        </Button>
      )}
    </div>
  )
}
