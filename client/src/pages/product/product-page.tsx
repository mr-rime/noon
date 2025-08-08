import { useQuery } from '@apollo/client'
import { useParams } from '@tanstack/react-router'
import { GET_PRODUCT } from '@/graphql/product'
import type { ProductSpecification, ProductType } from '@/types'
import { ProductReviews } from '../../components/product-reviews/product-reviews'
import { Separator } from '../../components/ui/separator'
import { ProductOverview } from './components/product-overview'
import { ProductOverviewTabs } from './components/product-overview-tabs'
import { ProductPageDetails } from './components/product-page-details'
import { ProductPageFulfilmentBadge } from './components/product-page-fulfilment-badge'
import { ProductPageImage } from './components/product-page-image'
import { ProductOption } from './components/product-page-options'
import { ProdcutPagePrice } from './components/product-page-price'
import { ProductPageRates } from './components/product-page-rates'
import { ProductPageTitle } from './components/product-page-title'
import { getMergedOptions } from './utils/get-merged-options'
import { Button } from '../../components/ui/button'
import { AddToWishlistButton } from './components/add-to-wishlist-button'
import { ProductPageLoadingSkeleton } from './components/product-page-loading-skeleton'

export function ProductPage() {
  const { productId } = useParams({
    from: '/(main)/_homeLayout/$title/$productId/',
  })
  const { data, loading } = useQuery<{
    getProduct: {
      success: boolean
      message: string
      product: ProductType
    }
  }>(GET_PRODUCT, { variables: { id: productId } })

  if (loading) return <ProductPageLoadingSkeleton />

  return (
    <main aria-label="Product Page" className="!scroll-smooth mb-32 overflow-x-hidden bg-white">
      <section
        aria-labelledby="product-main-section"
        className="site-container relative flex w-full flex-col items-start justify-start space-y-10 px-5 pt-10 lg:flex-row lg:space-x-10 lg:space-y-0 ">
        <div className="fixed bottom-0 left-0 z-10 flex w-full items-center bg-white px-2 py-2 md:hidden">
          <button className="flex h-[60px] w-[55px] flex-col items-center justify-center border border-[#f1f3f9] bg-white p-[3px] px-[10px] text-inherit">
            <span className="text-[#8d94a7] text-[1rem]">Qty</span>
            <span className="font-bold text-[1.5rem] text-inherit">1</span>
          </button>
          <Button className="h-[48px] w-full cursor-pointer rounded-[4px] bg-[#2B4CD7] font-bold text-[14px] text-white uppercase transition-colors hover:bg-[#6079E1]">
            Add to cart
          </Button>
        </div>
        <div className="mb-0 block md:hidden">
          <ProductPageTitle className="block text-[18px] md:hidden" title={data?.getProduct.product.name as string} />
          <div className="mt-6 mb-4 flex w-full items-center justify-between ">
            <ProductPageRates theme="mobile" />
            <AddToWishlistButton />
          </div>
        </div>
        <ProductPageImage images={data?.getProduct.product.images.map((image) => image.image_url) || ['']} />

        <div
          className="flex w-full flex-col items-start justify-center lg:w-[calc(500/1200*100%)]"
          aria-labelledby="product-info-section">
          <ProductPageTitle className="hidden md:block" title={data?.getProduct.product?.name as string} />
          <div className="hidden md:block">
            <ProductPageRates />
          </div>
          <ProdcutPagePrice
            price={data?.getProduct.product.price as number}
            currency={data?.getProduct.product.currency as string}
            discount_percentage={data?.getProduct.product.discount_percentage}
            final_price={data?.getProduct.product.final_price}
          />
          <ProductPageFulfilmentBadge />
          <Separator className="my-5" />
          <div className="flex flex-col items-start justify-center space-y-5">
            {getMergedOptions(data?.getProduct.product.productOptions || []).map((option) => (
              <ProductOption key={option.name} name={option.name} values={option.values} />
            ))}
          </div>
        </div>

        <div className="flex w-full flex-col items-start justify-center md:hidden">
          <div className="w-full">
            <ProductPageDetails product={data?.getProduct.product as ProductType} theme="mobile" />
          </div>
        </div>
        <div className="max-md:hidden">
          <ProductPageDetails product={data?.getProduct.product as ProductType} />
        </div>
      </section>
      <section id="porduct_overview">
        <Separator className="mt-16 mb-5 h-[9px] bg-[#F3F4F8]" />
        <ProductOverviewTabs />
      </section>
      <section className="site-container mt-10">
        <ProductOverview
          overview={data?.getProduct.product.product_overview as string}
          specs={data?.getProduct.product.productSpecifications as ProductSpecification[]}
        />
      </section>

      <Separator className="mt-20 mb-5 h-[9px] bg-[#F3F4F8]" />
      <ProductReviews />
    </main>
  )
}
