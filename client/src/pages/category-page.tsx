import { useLocation, useParams } from '@tanstack/react-router'
import { useQuery } from '@apollo/client'
import { gql } from '@apollo/client'
import { useState, useMemo, useCallback } from 'react'
import CategoryCarousel from '../components/category/category-carousel'
import Breadcrumb from '../components/category/breadcrumb'
import FilterSidebar, { FilterSidebarSkeleton } from '../components/filters/filter-sidebar'
import { Product } from '@/components/product/product'
import { ProductsListSkeleton } from '@/components/ui/products-list-skeleton'
import { GET_CATEGORY_BY_NESTED_PATH } from '../graphql/category'
import { Button } from '@/components/ui/button'
import { BouncingLoading } from '@/components/ui/bouncing-loading'

const GET_CATEGORY_BY_SLUG = gql`
  query GetCategoryBySlug($slug: String!) {
    getCategoryBySlug(slug: $slug) {
      success
      category {
        category_id
        name
        slug
        description
        level
        children {
          category_id
          name
          slug
          product_count
          level
          children {
            category_id
            name
            slug
            product_count
            level
            children {
              category_id
              name
              slug
              product_count
              level
            }
          }
        }
      }
    }
  }
`

const GET_FILTERED_PRODUCTS = gql`
  query GetFilteredProducts(
    $search: String
    $categoryId: String
    $categories: [String]
    $brands: [Int]
    $minPrice: Float
    $maxPrice: Float
    $minRating: Float
    $limit: Int
    $offset: Int
  ) {
    getProducts(
      search: $search
      categoryId: $categoryId
      categories: $categories
      brands: $brands
      minPrice: $minPrice
      maxPrice: $maxPrice
      minRating: $minRating
      limit: $limit
      offset: $offset
    ) {
      success
      products {
        id
        name
        slug
        price
        final_price
        product_overview
        category_id
        images {
          image_url
          is_primary
        }
        brand {
          name
        }
        rating
        review_count
      }
      totalCount
    }
  }
`

interface FilterState {
  category?: string | null
  categories?: string[]
  brands?: number[]
  minPrice?: number
  maxPrice?: number
  minRating?: number
}

export default function CategoryPage() {
  const params = useParams({ from: '/(main)/_homeLayout/category/$' })
  const categoryPath = (params as any)._splat || ''
  const [filters, setFilters] = useState<FilterState>({})
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)
  const [limit, setLimit] = useState(20)
  const [loadingMore, setLoadingMore] = useState(false)

  const isNestedPath = categoryPath.includes('/')

  const queryToUse = isNestedPath ? GET_CATEGORY_BY_NESTED_PATH : GET_CATEGORY_BY_SLUG
  const variables = isNestedPath ? { path: categoryPath } : { slug: categoryPath }

  const { data: categoryData, loading: categoryLoading } = useQuery(
    queryToUse,
    {
      variables,
      skip: !categoryPath
    }
  )

  const category = categoryData?.getCategoryByNestedPath?.category ||
    categoryData?.getCategoryBySlug?.category

  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const rawSearch = searchParams.get('q') || undefined
  const search = isNestedPath ? undefined : rawSearch

  const { data: productsData, loading: productsLoading, refetch: refetchProducts } = useQuery(GET_FILTERED_PRODUCTS, {
    skip: !category && !search,
    variables: {
      search,
      categoryId:
        filters.categories && filters.categories.length > 0
          ? null
          : category?.category_id,
      categories:
        filters.categories && filters.categories.length > 0
          ? filters.categories
          : undefined,
      brands: filters.brands,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      minRating: filters.minRating,
      limit,
    },
  })

  const products = useMemo(() => productsData?.getProducts?.products || [], [productsData?.getProducts?.products])
  const totalCount = productsData?.getProducts?.totalCount || 0
  const hasMore = products.length >= limit && products.length < totalCount

  const handleLoadMore = useCallback(async () => {
    if (!hasMore || productsLoading || loadingMore) return

    setLoadingMore(true)
    const newLimit = limit + 20

    try {
      await refetchProducts({
        search,
        categoryId:
          filters.categories && filters.categories.length > 0
            ? null
            : category?.category_id,
        categories:
          filters.categories && filters.categories.length > 0
            ? filters.categories
            : undefined,
        brands: filters.brands,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        minRating: filters.minRating,
        limit: newLimit,
      })
      setLimit(newLimit)
    } catch (error) {
      console.error('Error loading more products:', error)
    } finally {
      setLoadingMore(false)
    }
  }, [hasMore, productsLoading, loadingMore, limit, refetchProducts, search, filters, category])


  const productList = useMemo(() => {
    return [...products].reverse().map((p: any) => (
      <Product
        key={p.id}
        id={p.id}
        name={p.name}
        images={p.images}
        currency={p.currency}
        price={p.price}
        final_price={p.final_price}
        discount_percentage={p.discount_percentage}
        is_in_wishlist={p.is_in_wishlist}
        wishlist_id={p.wishlist_id}
        rating={p.rating}
        review_count={p.review_count}
        imageHeight={290}
      />
    ))
  }, [products])

  if (categoryLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex gap-6">
            <FilterSidebarSkeleton />
            <div className="flex-1 p-2">
              <ProductsListSkeleton />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!category && !search) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900">Category not found</h2>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CategoryCarousel />

      {category && <Breadcrumb categoryId={category.category_id} />}

      <div className="px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
        <div className="mb-4 flex items-center justify-between lg:hidden">
          <button
            type="button"
            className="rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            onClick={() => setIsMobileFiltersOpen((prev) => !prev)}>
            {isMobileFiltersOpen ? 'Hide Filters' : 'Show Filters'}
          </button>
          <span className="text-sm text-gray-500">{totalCount} items</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          <div className={`lg:w-80 xl:w-96 flex-shrink-0 ${isMobileFiltersOpen ? '' : 'hidden lg:block'}`}>
            <div className="lg:sticky lg:top-24">
              <FilterSidebar
                currentCategoryId={category?.category_id}
                onFiltersChange={setFilters}
              />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            {productsLoading && products.length === 0 ? (
              <div className="p-2">
                <ProductsListSkeleton />
              </div>
            ) : products.length === 0 && !productsLoading ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <p className="text-gray-500">No products found</p>
              </div>
            ) : (
              <>
                <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Top picks for you</h2>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                  {productList}
                </div>

                {hasMore && (
                  <div className="mt-8 flex justify-center">
                    <Button
                      onClick={handleLoadMore}
                      disabled={productsLoading || loadingMore}>
                      {loadingMore ? (
                        <div className="flex items-center gap-2">
                          <span>Loading</span>
                          <div className="scale-75">
                            <BouncingLoading />
                          </div>
                        </div>
                      ) : (
                        'Load more products'
                      )}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}