import { Suspense, useMemo } from 'react'
import { useQuery } from '@apollo/client'
import HeroSection from '@/features/landing/components/hero-section'
import RecommendedProducts from '@/features/landing/components/recommended-products'
import { PreviouslyBrowsedProducts, BestDeals, DiscountedProducts, OtherProducts } from './components'
import { ProductsListSkeleton } from '@/shared/components/ui/products-list-skeleton'
import { HeroBanner, SecondaryBanner, MobileBanner } from '@/features/landing/components/banners/banner-display'
import CategoryCarousel from '@/shared/components/category/category-carousel'
import { GET_HOME } from '@/features/landing/api/home'
import type { ProductType } from '@/shared/types'

export function Landing() {
  const { data, loading } = useQuery<{
    getHome: {
      success: boolean
      message: string
      home: {
        recommendedForYou?: ProductType[]
        previouslyBrowsed?: ProductType[]
        bestDeals?: ProductType[]
        discountedProducts?: ProductType[]
      }
    }
  }>(GET_HOME, {
    variables: { limit: 80, offset: 0, search: '' },
    fetchPolicy: 'cache-and-network',
  })

  const { recommended, previouslyBrowsed, bestDeals, discounted, excludedIds } = useMemo(() => {
    const home = data?.getHome?.home
    const recommended = home?.recommendedForYou ?? []
    const previouslyBrowsed = home?.previouslyBrowsed ?? []
    const bestDeals = home?.bestDeals ?? []
    const discounted = home?.discountedProducts ?? []

    const seen = new Set<string>()
    const collectIds = (list: ProductType[] | undefined) => {
      for (const p of list ?? []) {
        if (p?.id != null) {
          seen.add(String(p.id))
        }
      }
    }

    collectIds(recommended)
    collectIds(previouslyBrowsed)
    collectIds(bestDeals)
    collectIds(discounted)

    return {
      recommended,
      previouslyBrowsed,
      bestDeals,
      discounted,
      excludedIds: Array.from(seen),
    }
  }, [data])

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
          <SecondaryBanner />
        </div>

        <div className="min-h-[440px] bg-white ">
          <h3 className="my-2 select-none text-center font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[50px] uppercase">
            <span className="text-black">Recommended</span> <span className="text-[#E4041B]">for you</span>
          </h3>
          <Suspense
            fallback={
              <div className="p-4">
                <ProductsListSkeleton />
              </div>
            }>

            <RecommendedProducts products={recommended} loading={loading} />
          </Suspense>
        </div>

        <PreviouslyBrowsedProducts products={previouslyBrowsed} loading={loading} />
        <BestDeals products={bestDeals} loading={loading} />
        <DiscountedProducts products={discounted} loading={loading} />
        <OtherProducts excludedIds={excludedIds} />
      </div>
    </div>
  )
}
