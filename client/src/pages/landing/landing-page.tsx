import { Suspense } from 'react'
import HeroSection from './components/hero-section'
import RecommendedProducts from './components/recommended-products'
import { ProductsListSkeleton } from '@/components/ui/products-list-skeleton'
import { HeroBanner, SecondaryBanner, MobileBanner } from '@/components/banners/banner-display'

// const LazyRecommendedProducts = lazy(() => import("./components/recommended-products"));

export function Landing() {
  return (
    <div className="site-container flex min-h-screen w-full flex-col justify-center">
      {/* Hero Banner - Desktop */}
      <div className="hidden md:block mb-6">
        <HeroBanner className="max-w-7xl mx-auto" />
      </div>

      {/* Mobile Banner */}
      <MobileBanner className="mb-4 px-4" />

      <HeroSection />

      {/* Secondary Banner */}
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
          {/* <LazyRecommendedProducts /> */}
          <RecommendedProducts />
        </Suspense>
      </div>
    </div>
  )
}
