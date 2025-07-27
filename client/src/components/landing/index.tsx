import { Suspense } from 'react'
import { ProductsListSkeleton } from '../ui/products-list-skeleton'
import HeroSection from './components/hero-section'
import RecommendedProducts from './components/recommended-products'

// const LazyRecommendedProducts = lazy(() => import("./components/recommended-products"));

export function Landing() {
  return (
    <div className="site-container flex min-h-screen w-full flex-col justify-center">
      <HeroSection />
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
