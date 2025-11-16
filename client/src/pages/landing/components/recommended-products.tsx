import { useQuery } from '@apollo/client'
import { Product } from '@/components/product/product'
import { InfinityCarousel } from '@/components/ui/carousel/infinity-carousel'
import { ProductsListSkeleton } from '@/components/ui/products-list-skeleton'
import type { ProductType } from '@/types'
import { GET_HOME } from '@/graphql/home'
import { useState, useCallback } from 'react'

export default function RecommendedProducts() {
  const [offset, setOffset] = useState(0)
  const limit = 10

  const { data, loading, fetchMore } = useQuery<{
    getHome: {
      success: boolean
      message: string
      home: {
        recommendedForYou: ProductType[]
      }
    }
  }>(GET_HOME, {
    variables: { limit, offset, search: '' },
    fetchPolicy: 'cache-and-network'
  })

  const products = data?.getHome.home?.recommendedForYou || []
  const hasMore = products.length >= limit && products.length % limit === 0

  const handleLoadMore = useCallback(() => {
    if (!hasMore || loading) return

    fetchMore({
      variables: { limit, offset: offset + limit },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev

        return {
          getHome: {
            ...prev.getHome,
            home: {
              ...prev.getHome.home,
              recommendedForYou: [...prev.getHome.home.recommendedForYou, ...fetchMoreResult.getHome.home.recommendedForYou]
            }
          }
        }
      }
    })

    setOffset(prev => prev + limit)
  }, [hasMore, loading, fetchMore, offset, limit])

  return (
    <div className="flex min-h-[200px] w-full items-center bg-white p-4">
      <div className="w-full">
        {loading && products.length === 0 ? (
          <ProductsListSkeleton />
        ) : (
          <InfinityCarousel
            className="w-full"
            controlClassName="flex items-center justify-center bg-white cursor-pointer w-[30px] h-[30px] shadow-[0_0_3px_-1px_rgba(0,0,0,.5)] border border-[#ccc]  "
            infinityScroll={true}
            onLoadMore={handleLoadMore}
            hasMore={hasMore}
            isLoading={loading}
            itemsPerView="auto"
            gap={16}
            showControls={true}
            loop={false}
          >
            {products.map((product) => (
              <Product key={product.id} {...product} />
            ))}
          </InfinityCarousel>
        )}
      </div>
    </div>
  )
}
