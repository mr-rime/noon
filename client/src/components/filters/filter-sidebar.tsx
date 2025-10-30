import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from '@tanstack/react-router'
import HierarchicalCategoryFilter from './hierarchical-category-filter'
import PriceFilter from './price-filter'
import BrandFilter from './brand-filter'
import RatingFilter from './rating-filter'
import { GET_CATEGORY_BREADCRUMB } from '@/graphql/category'
import { useLazyQuery } from '@apollo/client'
import { Skeleton } from '@/components/ui/skeleton'

interface FilterState {
  brands: number[]
  minPrice?: number
  maxPrice?: number
  minRating?: number
}

interface FilterSidebarProps {
  currentCategoryId?: string
  onFiltersChange?: (filters: FilterState) => void
}



export default function FilterSidebar({
  currentCategoryId,
  onFiltersChange
}: FilterSidebarProps) {

  const [getBreadcrumb] = useLazyQuery(GET_CATEGORY_BREADCRUMB)


  const location = useLocation()

  const [filters, setFilters] = useState<FilterState>({
    brands: [],
    minPrice: undefined,
    maxPrice: undefined,
    minRating: undefined,
  })

  const navigate = useNavigate()



  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const newFilters: FilterState = {
      brands: searchParams.get('brands')?.split(',').map(Number).filter(Boolean) || [],
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
      minRating: searchParams.get('minRating') ? Number(searchParams.get('minRating')) : undefined,
    }
    setFilters(newFilters)
  }, [location.search, currentCategoryId])


  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updated = { ...filters, ...newFilters }
    setFilters(updated)


    const params = new URLSearchParams(location.search)

    if (updated.brands.length > 0) {
      params.set('brands', updated.brands.join(','))
    }
    if (updated.minPrice !== undefined) {
      params.set('minPrice', updated.minPrice.toString())
    }
    if (updated.maxPrice !== undefined) {
      params.set('maxPrice', updated.maxPrice.toString())
    }
    if (updated.minRating !== undefined) {
      params.set('minRating', updated.minRating.toString())
    }


    window.history.replaceState(null, '', `${location.pathname}?${params.toString()}`)
    onFiltersChange?.(updated)
  }

  const handleCategoryToggle = async (categoryId: string) => {
    try {
      const { data } = await getBreadcrumb({ variables: { categoryId } })
      const breadcrumb = data?.getCategoryBreadcrumb?.breadcrumb || []
      const fullPath = breadcrumb.map((b: any) => b.slug).join('/')


      const currentPath = location.pathname.replace(/^\/category\/?/, '')

      if (currentPath === fullPath) {
        const upOne = fullPath.split('/').slice(0, -1).join('/')
        if (upOne) {
          navigate({ to: `/category/$`, params: { _splat: upOne } })
        } else {
          navigate({ to: '/category/$' })
        }
      } else {
        navigate({ to: `/category/$`, params: { _splat: fullPath } })
      }
    } catch (err) {
      console.error('Failed to fetch breadcrumb:', err)
    }
  }


  const handleBrandToggle = (brandId: number) => {
    const newBrands = filters.brands.includes(brandId)
      ? filters.brands.filter(id => id !== brandId)
      : [...filters.brands, brandId]
    updateFilters({ brands: newBrands })
  }


  const handlePriceApply = (min: number, max: number) => {
    updateFilters({ minPrice: min, maxPrice: max })
  }

  const handleRatingSelect = (rating: number) => {
    updateFilters({ minRating: rating })
  }



  return (
    <div className="w-[350px] flex-shrink-0">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Filters</h2>

          <div className="space-y-4">

            <HierarchicalCategoryFilter
              selectedCategories={[]}
              onCategoryToggle={handleCategoryToggle}
            />


            <BrandFilter
              selectedBrands={filters.brands}
              onBrandToggle={handleBrandToggle}
              onClear={() => updateFilters({ brands: [] })}
            />

            <PriceFilter
              min={filters.minPrice}
              max={filters.maxPrice}
              onApply={handlePriceApply}
              onClear={() => updateFilters({ minPrice: undefined, maxPrice: undefined })}
            />


            <RatingFilter
              minRating={filters.minRating}
              onRatingSelect={handleRatingSelect}
              onClear={() => updateFilters({ minRating: undefined })}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export function FilterSidebarSkeleton() {
  return (
    <div className="w-[350px] flex-shrink-0">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 space-y-4">
          <Skeleton className="h-[22px] w-[120px]" />
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-3 border-b border-gray-200 pb-4">
                <Skeleton className="h-[18px] w-[160px]" />
                <div className="space-y-2">
                  <Skeleton className="h-[14px] w-[80%]" />
                  <Skeleton className="h-[14px] w-[70%]" />
                  <Skeleton className="h-[14px] w-[60%]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
