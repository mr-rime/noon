import { useState, useEffect } from 'react'
import { useLocation } from '@tanstack/react-router'
import CategoryFilter from './category-filter'
import PriceFilter from './price-filter'
import BrandFilter from './brand-filter'
import RatingFilter from './rating-filter'
import SellerFilter from './seller-filter'

interface FilterState {
  categories: number[]
  brands: number[]
  sellers: number[]
  minPrice?: number
  maxPrice?: number
  minRating?: number
  priceDrop: boolean
  newArrivals: boolean
  fulfilment: string[]
  condition: string[]
}

interface FilterSidebarProps {
  currentCategoryId?: number
  onFiltersChange?: (filters: FilterState) => void
}

export default function FilterSidebar({
  currentCategoryId,
  onFiltersChange
}: FilterSidebarProps) {
  const location = useLocation()

  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    brands: [],
    sellers: [],
    minPrice: undefined,
    maxPrice: undefined,
    minRating: undefined,
    priceDrop: false,
    newArrivals: false,
    fulfilment: [],
    condition: []
  })

  // Parse filters from URL params on mount
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const urlCategories = searchParams.get('categories')?.split(',').map(Number).filter(Boolean) || []

    // If currentCategoryId is provided and not in URL categories, include it
    const categories = currentCategoryId && !urlCategories.includes(currentCategoryId)
      ? [...urlCategories, currentCategoryId]
      : urlCategories

    const newFilters: FilterState = {
      categories,
      brands: searchParams.get('brands')?.split(',').map(Number).filter(Boolean) || [],
      sellers: searchParams.get('sellers')?.split(',').map(Number).filter(Boolean) || [],
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
      minRating: searchParams.get('minRating') ? Number(searchParams.get('minRating')) : undefined,
      priceDrop: searchParams.get('priceDrop') === 'true',
      newArrivals: searchParams.get('newArrivals') === 'true',
      fulfilment: searchParams.get('fulfilment')?.split(',') || [],
      condition: searchParams.get('condition')?.split(',') || []
    }
    setFilters(newFilters)
  }, [location.search, currentCategoryId])

  // Update URL params when filters change
  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updated = { ...filters, ...newFilters }
    setFilters(updated)

    // Update URL params
    const params = new URLSearchParams(location.search)

    if (updated.categories.length > 0) {
      params.set('categories', updated.categories.join(','))
    }
    if (updated.brands.length > 0) {
      params.set('brands', updated.brands.join(','))
    }
    if (updated.sellers.length > 0) {
      params.set('sellers', updated.sellers.join(','))
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
    if (updated.priceDrop) {
      params.set('priceDrop', 'true')
    }
    if (updated.newArrivals) {
      params.set('newArrivals', 'true')
    }
    if (updated.fulfilment.length > 0) {
      params.set('fulfilment', updated.fulfilment.join(','))
    }
    if (updated.condition.length > 0) {
      params.set('condition', updated.condition.join(','))
    }

    // Navigate with updated search params
    window.history.replaceState(null, '', `${location.pathname}?${params.toString()}`)
    onFiltersChange?.(updated)
  }

  const handleCategoryToggle = (categoryId: number) => {
    const newCategories = filters.categories.includes(categoryId)
      ? filters.categories.filter(id => id !== categoryId)
      : [...filters.categories, categoryId]
    updateFilters({ categories: newCategories })
  }

  const handleBrandToggle = (brandId: number) => {
    const newBrands = filters.brands.includes(brandId)
      ? filters.brands.filter(id => id !== brandId)
      : [...filters.brands, brandId]
    updateFilters({ brands: newBrands })
  }

  const handleSellerToggle = (sellerId: number) => {
    const newSellers = filters.sellers.includes(sellerId)
      ? filters.sellers.filter(id => id !== sellerId)
      : [...filters.sellers, sellerId]
    updateFilters({ sellers: newSellers })
  }

  const handlePriceApply = (min: number, max: number) => {
    updateFilters({ minPrice: min, maxPrice: max })
  }

  const handleRatingSelect = (rating: number) => {
    updateFilters({ minRating: rating })
  }

  // Sample sellers data (would come from API in real app)
  const sellers = [
    { id: 1, name: 'Cover Line', productCount: 45 },
    { id: 2, name: 'Beauty store', productCount: 32 },
    { id: 3, name: 'OLX print', productCount: 28 },
    { id: 4, name: 'TENtech', productCount: 21 },
    { id: 5, name: 'Origon', productCount: 18 },
    { id: 6, name: 'CompuTouch', productCount: 15 },
    { id: 7, name: 'EL Gemma', productCount: 12 },
    { id: 8, name: 'LOOK UP', productCount: 8 }
  ]

  return (
    <div className="w-64 flex-shrink-0">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Filters</h2>

          <div className="space-y-4">
            {/* Fulfillment Filter */}
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Fulfillment</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.fulfilment.includes('express')}
                    onChange={(e) => {
                      const newFulfilment = e.target.checked
                        ? [...filters.fulfilment, 'express']
                        : filters.fulfilment.filter(f => f !== 'express')
                      updateFilters({ fulfilment: newFulfilment })
                    }}
                    className="mr-2 rounded border-gray-300 text-blue-600"
                  />
                  <span className="text-sm">Express Delivery</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.fulfilment.includes('fulfilled')}
                    onChange={(e) => {
                      const newFulfilment = e.target.checked
                        ? [...filters.fulfilment, 'fulfilled']
                        : filters.fulfilment.filter(f => f !== 'fulfilled')
                      updateFilters({ fulfilment: newFulfilment })
                    }}
                    className="mr-2 rounded border-gray-300 text-blue-600"
                  />
                  <span className="text-sm">Fulfilled by noon</span>
                </label>
              </div>
            </div>

            {/* Category Filter */}
            <CategoryFilter
              currentCategoryId={currentCategoryId}
              selectedCategories={filters.categories}
              onCategoryToggle={handleCategoryToggle}
              onClear={() => updateFilters({ categories: [] })}
            />

            {/* Brand Filter */}
            <BrandFilter
              selectedBrands={filters.brands}
              onBrandToggle={handleBrandToggle}
              onClear={() => updateFilters({ brands: [] })}
            />

            {/* Price Filter */}
            <PriceFilter
              min={filters.minPrice}
              max={filters.maxPrice}
              onApply={handlePriceApply}
              onClear={() => updateFilters({ minPrice: undefined, maxPrice: undefined })}
            />

            {/* Price Drop */}
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Price Drop</h3>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.priceDrop}
                  onChange={(e) => updateFilters({ priceDrop: e.target.checked })}
                  className="mr-2 rounded border-gray-300 text-blue-600"
                />
                <span className="text-sm">Items with price drops</span>
              </label>
            </div>

            {/* Rating Filter */}
            <RatingFilter
              minRating={filters.minRating}
              onRatingSelect={handleRatingSelect}
              onClear={() => updateFilters({ minRating: undefined })}
            />

            {/* New Arrivals */}
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">New Arrivals</h3>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.newArrivals}
                  onChange={(e) => updateFilters({ newArrivals: e.target.checked })}
                  className="mr-2 rounded border-gray-300 text-blue-600"
                />
                <span className="text-sm">Last 30 days</span>
              </label>
            </div>

            {/* Item Condition */}
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Item Condition</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.condition.includes('new')}
                    onChange={(e) => {
                      const newCondition = e.target.checked
                        ? [...filters.condition, 'new']
                        : filters.condition.filter(c => c !== 'new')
                      updateFilters({ condition: newCondition })
                    }}
                    className="mr-2 rounded border-gray-300 text-blue-600"
                  />
                  <span className="text-sm">New</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.condition.includes('refurbished')}
                    onChange={(e) => {
                      const newCondition = e.target.checked
                        ? [...filters.condition, 'refurbished']
                        : filters.condition.filter(c => c !== 'refurbished')
                      updateFilters({ condition: newCondition })
                    }}
                    className="mr-2 rounded border-gray-300 text-blue-600"
                  />
                  <span className="text-sm">Refurbished</span>
                </label>
              </div>
            </div>

            {/* Seller Filter */}
            <SellerFilter
              sellers={sellers}
              selectedSellers={filters.sellers}
              onSellerToggle={handleSellerToggle}
              onClear={() => updateFilters({ sellers: [] })}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
