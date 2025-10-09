import { Link, useParams } from '@tanstack/react-router'
import { ChevronRight, Star } from 'lucide-react'
import { Separator } from '../../../components/ui/separator'
import { product_page_icon } from '../constants/icons'
import { Button } from '@/components/ui/button'
import { useMutation } from '@apollo/client'
import { ADD_CART_ITEM, GET_CART_ITEMS } from '@/graphql/cart'
import type { ProductType } from '@/types'
import { toast } from 'sonner'
import { BouncingLoading } from '@/components/ui/bouncing-loading'
import { Image } from '@unpic/react'

export function ProductPageDetails({
  theme = 'desktop',
  product,
}: {
  theme?: 'mobile' | 'desktop'
  product?: ProductType
}) {
  const { productId } = useParams({ from: '/(main)/_homeLayout/$title/$productId/' })
  const [addCartItem, { loading }] = useMutation(ADD_CART_ITEM, {
    refetchQueries: [GET_CART_ITEMS],
    awaitRefetchQueries: true,
  })

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
              <span className="font-bold text-[#008000] text-[14px]">4.3</span>
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
        {Number(product?.stock) === 0 ? (
          <Button
            disabled
            className="flex h-[48px] w-full cursor-default items-center justify-center rounded-[14px] bg-[#6079E1] font-bold text-[14px] text-white uppercase transition-colors hover:bg-[#6079E1]">
            Out of stock
          </Button>
        ) : (
          <Button
            onClick={async () => {
              const { data } = await addCartItem({ variables: { product_id: productId, quantity: 1 } })
              if (data.addToCart.success) {
                toast.success('Product added to cart successfully.')
              } else {
                toast.error('Failed to add product to cart. Please try again.')
              }
            }}
            className="flex h-[48px] w-full cursor-pointer items-center justify-center rounded-[14px] bg-[#2B4CD7] font-bold text-[14px] text-white uppercase transition-colors hover:bg-[#6079E1]">
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
                  <span>4.7</span>
                  <Star fill="white" color="white" size={9} />
                </div>
                <div className="text-[12px]">96% Positive Ratings</div>
              </div>
            </div>
          </div>
          <ChevronRight size={20} />
        </Link>
      </button>
      <Separator className="my-5" />
    </div>
  )
}
