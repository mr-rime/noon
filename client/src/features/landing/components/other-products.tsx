import { useCallback, useMemo, useState, useRef, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { ProductsListSkeleton } from '@/shared/components/ui/products-list-skeleton'
import { Product } from '@/shared/components/product/product'
import { GET_PRODUCTS } from '@/features/product/api/product'
import type { ProductType } from '@/shared/types'

interface OtherProductsProps {
    excludedIds: string[]
}

export default function OtherProducts({ excludedIds }: OtherProductsProps) {
    const [page, setPage] = useState(1)
    const [isLoadingMore, setIsLoadingMore] = useState(false)
    const limit = 20
    const maxProducts = 50
    const observerRef = useRef<IntersectionObserver | null>(null)
    const loadMoreRef = useRef<HTMLDivElement>(null)

    const { data, loading, fetchMore } = useQuery(GET_PRODUCTS, {
        variables: { limit, offset: 0, search: '' },
        fetchPolicy: 'cache-and-network',
    })

    const excludedSet = useMemo(() => new Set(excludedIds), [excludedIds])

    const products = useMemo<ProductType[]>(() => {
        const raw = (data?.getProducts?.products || []) as ProductType[]
        return raw.filter((p) => p?.id && !excludedSet.has(String(p.id)))
    }, [data, excludedSet])

    const total = data?.getProducts?.total ?? 0
    const hasMore = products.length < total && products.length < maxProducts && !loading && !isLoadingMore

    const handleLoadMore = useCallback(() => {
        if (!hasMore || loading || isLoadingMore || products.length >= maxProducts) return

        setIsLoadingMore(true)
        const nextPage = page + 1

        fetchMore({
            variables: {
                limit,
                offset: (nextPage - 1) * limit,
                search: '',
            },
            updateQuery: (prev, { fetchMoreResult }) => {
                if (!fetchMoreResult) return prev

                return {
                    getProducts: {
                        ...fetchMoreResult.getProducts,
                        products: [...prev.getProducts.products, ...fetchMoreResult.getProducts.products],
                    },
                }
            },
        }).finally(() => {
            setIsLoadingMore(false)
        })

        setPage(nextPage)
    }, [fetchMore, hasMore, limit, loading, page, products.length, maxProducts, isLoadingMore])

    useEffect(() => {
        if (!loadMoreRef.current || !hasMore) return

        observerRef.current = new IntersectionObserver(
            (entries) => {
                const target = entries[0]
                if (target.isIntersecting && hasMore && !loading && !isLoadingMore) {
                    handleLoadMore()
                }
            },
            {
                threshold: 0.1,
                rootMargin: '100px',
            }
        )

        observerRef.current.observe(loadMoreRef.current)

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect()
            }
        }
    }, [hasMore, loading, isLoadingMore, handleLoadMore])

    if ((loading || isLoadingMore) && products.length === 0) {
        return (
            <div className="mt-10 bg-white">
                <h3 className="my-2 select-none text-center font-extrabold text-xl sm:text-2xl md:text-3xl lg:text-4xl uppercase">
                    <span className="text-black">Products</span> <span className="text-[#E4041B]">you'll like</span>
                </h3>
                <div className="px-2 py-4 md:px-4">
                    <ProductsListSkeleton />
                </div>
            </div>
        )
    }

    if (!loading && !isLoadingMore && products.length === 0) {
        return null
    }

    return (
        <div className="mt-10 bg-white">
            <h3 className="my-2 select-none text-center font-extrabold text-xl sm:text-2xl md:text-3xl lg:text-4xl uppercase">
                <span className="text-black">Products</span> <span className="text-[#E4041B]">you'll like</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-4 px-2 py-4 md:px-4">
                {products.map((product) => (
                    <Product key={product.id} {...product} />
                ))}
            </div>
            {hasMore && (loading || isLoadingMore) && (
                <div ref={loadMoreRef} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-4 px-2 py-4 md:px-4">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <div key={`skeleton-${index}`} className="animate-pulse">
                            <div className="bg-gray-200 rounded-lg h-48 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded mb-1"></div>
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
