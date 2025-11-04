import { Suspense } from 'react'
import HeroSection from './components/hero-section'
import RecommendedProducts from './components/recommended-products'
import { PreviouslyBrowsedProducts, BestDeals, DiscountedProducts } from './components'
import { ProductsListSkeleton } from '@/components/ui/products-list-skeleton'
import { HeroBanner, SecondaryBanner, MobileBanner } from '@/components/banners/banner-display'
import CategoryCarousel from '@/components/category/category-carousel'



export function Landing() {
  return (
    <div className=" flex min-h-screen w-full flex-col justify-center">

      <CategoryCarousel />

      <div className="site-container hidden md:block mb-6 mt-4">
        <HeroBanner className="max-w-7xl mx-auto" />
      </div>


      <div className='site-container'>
        <MobileBanner className="mb-4 px-4" />
        <HeroSection />
        <div className="my-8 px-4">
          <SecondaryBanner className="max-w-4xl mx-auto" />
        </div>

        <div className="min-h-[467px] bg-white ">
          <h3 className="my-2 select-none text-center font-extrabold text-[50px] uppercase">
            <span className="text-black">Recommended</span> <span className="text-[#E4041B]">for you</span>
          </h3>
          <Suspense
            fallback={
              <div className="p-4">
                <ProductsListSkeleton />
              </div>
            }>

            <RecommendedProducts />
          </Suspense>
        </div>

        <div className="min-h-[467px] bg-white mt-10">
          <h3 className="my-2 select-none text-center font-extrabold text-[36px] uppercase">
            <span className="text-black">Previously</span> <span className="text-[#E4041B]">browsed</span>
          </h3>
          <PreviouslyBrowsedProducts />
        </div>

        <div className="min-h-[467px] bg-white mt-10">
          <h3 className="my-2 select-none text-center font-extrabold text-[36px] uppercase">
            <span className="text-black">Best</span> <span className="text-[#E4041B]">deals for you</span>
          </h3>
          <BestDeals />
        </div>

        <div className="min-h-[467px] bg-white mt-10">
          <h3 className="my-2 select-none text-center font-extrabold text-[36px] uppercase">
            <span className="text-black">Products</span> <span className="text-[#E4041B]">on discount</span>
          </h3>
          <DiscountedProducts />
        </div>
      </div>
    </div>
  )
}
