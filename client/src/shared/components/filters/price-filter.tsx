import { useState } from 'react'
import { ChevronDown, X } from 'lucide-react'

interface PriceFilterProps {
  min?: number
  max?: number
  onApply: (min: number, max: number) => void
  onClear: () => void
  currency?: string
}

export default function PriceFilter({
  min: currentMin,
  max: currentMax,
  onApply,
  onClear,
}: PriceFilterProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [minPrice, setMinPrice] = useState(currentMin?.toString() || '')
  const [maxPrice, setMaxPrice] = useState(currentMax?.toString() || '')

  const hasValue = currentMin !== undefined || currentMax !== undefined

  const handleApply = () => {
    const min = minPrice ? parseInt(minPrice) : 0
    const max = maxPrice ? parseInt(maxPrice) : 999999

    if (min <= max) {
      onApply(min, max)
    }
  }

  const handleClear = () => {
    setMinPrice('')
    setMaxPrice('')
    onClear()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleApply()
    }
  }

  return (
    <div className="border-b border-gray-200 pb-4">

      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full text-left"
        >
          <span className="text-sm font-medium text-gray-900">Price</span>
          <ChevronDown
            className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? 'transform rotate-180' : ''
              }`}
          />
        </button>

        {hasValue && (
          <button
            onClick={handleClear}
            className="ml-2 text-xs text-blue-600 hover:text-blue-800 flex items-center"
          >
            Clear
            <X className="h-3 w-3 ml-1" />
          </button>
        )}
      </div>


      {isOpen && (
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              onKeyDown={handleKeyPress}
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <span className="text-gray-500 text-sm">TO</span>
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              onKeyDown={handleKeyPress}
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={handleApply}
            className="w-full py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
          >
            GO
          </button>
        </div>
      )}
    </div>
  )
}
