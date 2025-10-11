import { useParams } from '@tanstack/react-router'
import { useQuery } from '@apollo/client'
import { gql } from '@apollo/client'
import { useState } from 'react'
import CategoryCarousel from '../components/category/category-carousel'
import Breadcrumb from '../components/category/breadcrumb'
import FilterSidebar from '../components/filters/filter-sidebar'
import ProductCard from '../components/product-card'
import CategoryTree, { CategoryGrid } from '../components/category/category-tree'
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
        }
      }
    }
  }
`

const GET_FILTERED_PRODUCTS = gql`
  query GetFilteredProducts(
    $categoryId: Int
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

export default function CategoryPage() {
  const params = useParams({ from: '/(main)/_homeLayout/category/$' })
  const categoryPath = (params as any)._splat || ''
  const [filters, setFilters] = useState({})
  const [page, setPage] = useState(1)
  const limit = 20

  // Determine if this is a nested path or single slug
  const isNestedPath = categoryPath.includes('/')

  // Get category info using appropriate query
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

  // Get filtered products
  const { data: productsData, loading: productsLoading } = useQuery(GET_FILTERED_PRODUCTS, {
    skip: !category,
    variables: {
      categoryId: category?.category_id,
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
      {/* Category Carousel */}
      <CategoryCarousel />

      {/* Breadcrumb */}
      <Breadcrumb categoryId={category.category_id} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <FilterSidebar
            currentCategoryId={category.category_id}
            onFiltersChange={setFilters}
          />

          {/* Product Grid */}
          <div className="flex-1">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
              <h1 className="text-2xl font-semibold text-gray-900">
                {category.name}
              </h1>
              {category.description && (
                <p className="mt-2 text-gray-600">{category.description}</p>
              )}
              <div className="mt-2 text-sm text-gray-500">
                {totalCount} Products
                {category.children && category.children.length > 0 && (
                  <span className="ml-2 text-xs text-blue-600">
                    (including products from subcategories)
                  </span>
                )}
              </div>
            </div>

            {/* Subcategories - Using Recursive Component */}
            {category.children && category.children.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Browse by Subcategory</h3>

                {/* Use CategoryGrid for immediate children */}
                <CategoryGrid
                  categories={category.children}
                  currentPath={categoryPath}
                  isNestedPath={isNestedPath}
                  basePath={isNestedPath ? categoryPath : category.slug}
                  columns={4}
                  className="mb-4"
                />

                {/* Show recursive tree for deeper nesting if there are nested children */}
                {category.children.some((child: any) => child.children && child.children.length > 0) && (
                  <>
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">All Categories</h4>
                      <CategoryTree
                        categories={category.children}
                        currentPath={categoryPath}
                        isNestedPath={isNestedPath}
                        basePath={isNestedPath ? categoryPath : category.slug}
                        maxDepth={3}
                        showExpandCollapse={true}
                        className="bg-gray-50 rounded-lg p-3"
                      />
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Products */}
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

                {/* Pagination */}
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
