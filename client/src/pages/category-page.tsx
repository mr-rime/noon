import { useParams } from '@tanstack/react-router'
import { useQuery } from '@apollo/client'
import { gql } from '@apollo/client'
import { useState } from 'react'
import CategoryCarousel from '../components/category/category-carousel'
import Breadcrumb from '../components/category/breadcrumb'
import FilterSidebar from '../components/filters/filter-sidebar'
import ProductCard from '../components/product-card'
import { Loader2 } from 'lucide-react'
import { GET_CATEGORY_BY_NESTED_PATH } from '../graphql/category'

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
    $categoryId: String
    $brands: [Int]
    $minPrice: Float
    $maxPrice: Float
    $minRating: Float
    $limit: Int
    $offset: Int
  ) {
    getProducts(
      categoryId: $categoryId
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
  sellers?: number[]
  minPrice?: number
  maxPrice?: number
  minRating?: number
  priceDrop?: boolean
  newArrivals?: boolean
  fulfilment?: string[]
  condition?: string[]
}

export default function CategoryPage() {
  const params = useParams({ from: '/(main)/_homeLayout/category/$' })
  const categoryPath = (params as any)._splat || ''
  const [filters, setFilters] = useState<FilterState>({})
  const [page, setPage] = useState(1)
  const limit = 20


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

  const { data: productsData, loading: productsLoading } = useQuery(GET_FILTERED_PRODUCTS, {
    skip: !category,
    variables: {
      categoryId: filters.categories && filters.categories.length > 0 ? null : category?.category_id,

      categories: filters.categories && filters.categories.length > 0 ? filters.categories : undefined,
      ...filters,
      limit,
      offset: (page - 1) * limit
    }
  })

  const products = productsData?.getProducts?.products || []
  const totalCount = productsData?.getProducts?.totalCount || 0
  const totalPages = Math.ceil(totalCount / limit)

  if (categoryLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (!category) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900">Category not found</h2>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CategoryCarousel />

      <Breadcrumb categoryId={category.category_id} />

      <div className=" px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          <FilterSidebar
            currentCategoryId={category.category_id}
            onFiltersChange={setFilters}
          />

          <div className="flex-1">
            {productsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <p className="text-gray-500">No products found</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {products.map((product: any) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="mt-6 flex justify-center">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>

                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum: number
                        if (totalPages <= 5) {
                          pageNum = i + 1
                        } else if (page <= 3) {
                          pageNum = i + 1
                        } else if (page >= totalPages - 2) {
                          pageNum = totalPages - 4 + i
                        } else {
                          pageNum = page - 2 + i
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() => setPage(pageNum)}
                            className={`px-3 py-1 rounded ${page === pageNum
                              ? 'bg-blue-600 text-white'
                              : 'border border-gray-300 hover:bg-gray-50'
                              }`}
                          >
                            {pageNum}
                          </button>
                        )
                      })}

                      <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
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
