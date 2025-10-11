import { useState } from 'react'
import { ChevronDown, Search, X } from 'lucide-react'
import { useQuery } from '@apollo/client'
import { gql } from '@apollo/client'

const GET_BRANDS = gql`
  query GetBrands($search: String) {
    getBrands(search: $search) {
      success
      brands {
        brand_id
        name
        slug
      }
    }
  }
`

interface Brand {
  brand_id: number
  name: string
  slug: string
}

interface BrandFilterProps {
  selectedBrands: number[]
  onBrandToggle: (brandId: number) => void
  onClear: () => void
}

export default function BrandFilter({
  selectedBrands,
  onBrandToggle,
  onClear
}: BrandFilterProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  
  const { data, loading } = useQuery(GET_BRANDS, {
    variables: { search: searchQuery }
  })
  
  const brands = data?.getBrands?.brands || []
  const hasSelection = selectedBrands.length > 0
  
  return (
    <div className="border-b border-gray-200 pb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full text-left"
        >
          <span className="text-sm font-medium text-gray-900">Brand</span>
          <ChevronDown
            className={`h-4 w-4 text-gray-500 transition-transform ${
              isOpen ? 'transform rotate-180' : ''
            }`}
          />
        </button>
        
        {hasSelection && (
          <button
            onClick={onClear}
            className="ml-2 text-xs text-blue-600 hover:text-blue-800 flex items-center"
          >
            Clear
            <X className="h-3 w-3 ml-1" />
          </button>
        )}
      </div>
      
      {/* Content */}
      {isOpen && (
        <div>
          {/* Search Box */}
          <div className="relative mb-3">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          
          {/* Brand List */}
          <div className="max-h-48 overflow-y-auto space-y-1">
            {loading ? (
              <div className="text-sm text-gray-500">Loading...</div>
            ) : brands.length === 0 ? (
              <div className="text-sm text-gray-500">No brands found</div>
            ) : (
              brands.map((brand: Brand) => (
                <label
                  key={brand.brand_id}
                  className="flex items-center py-1 hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand.brand_id)}
                    onChange={() => onBrandToggle(brand.brand_id)}
                    className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{brand.name}</span>
                </label>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
