import { useState } from 'react'
import { ChevronDown, X } from 'lucide-react'

interface Seller {
  id: number
  name: string
  productCount?: number
}

interface SellerFilterProps {
  sellers: Seller[]
  selectedSellers: number[]
  onSellerToggle: (sellerId: number) => void
  onClear: () => void
}

export default function SellerFilter({
  sellers,
  selectedSellers,
  onSellerToggle,
  onClear
}: SellerFilterProps) {
  const [isOpen, setIsOpen] = useState(true)
  
  const hasSelection = selectedSellers.length > 0
  
  return (
    <div className="border-b border-gray-200 pb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full text-left"
        >
          <span className="text-sm font-medium text-gray-900">Seller</span>
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
        <div className="max-h-48 overflow-y-auto space-y-1">
          {sellers.length === 0 ? (
            <div className="text-sm text-gray-500">No sellers available</div>
          ) : (
            sellers.map(seller => (
              <label
                key={seller.id}
                className="flex items-center py-1 hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedSellers.includes(seller.id)}
                  onChange={() => onSellerToggle(seller.id)}
                  className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  {seller.name}
                  {seller.productCount && (
                    <span className="ml-1 text-xs text-gray-500">
                      ({seller.productCount})
                    </span>
                  )}
                </span>
              </label>
            ))
          )}
        </div>
      )}
    </div>
  )
}
