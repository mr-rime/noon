import { useState } from 'react'
import { ChevronDown, Star, X } from 'lucide-react'

interface RatingFilterProps {
  minRating?: number
  onRatingSelect: (rating: number) => void
  onClear: () => void
}

export default function RatingFilter({
  minRating,
  onRatingSelect,
  onClear
}: RatingFilterProps) {
  const [isOpen, setIsOpen] = useState(true)
  
  const ratings = [5, 4, 3, 2, 1]
  
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating 
            ? 'fill-yellow-400 text-yellow-400' 
            : 'text-gray-300'
        }`}
      />
    ))
  }
  
  return (
    <div className="border-b border-gray-200 pb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full text-left"
        >
          <span className="text-sm font-medium text-gray-900">Product Rating</span>
          <ChevronDown
            className={`h-4 w-4 text-gray-500 transition-transform ${
              isOpen ? 'transform rotate-180' : ''
            }`}
          />
        </button>
        
        {minRating && (
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
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>{minRating ? `${minRating} Stars or more` : '1.8 Stars or more'}</span>
          </div>
          
          {/* Rating Slider */}
          <div className="relative">
            <input
              type="range"
              min="1"
              max="5"
              step="0.1"
              value={minRating || 1.8}
              onChange={(e) => onRatingSelect(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${
                  ((minRating || 1.8) - 1) * 25
                }%, #E5E7EB ${((minRating || 1.8) - 1) * 25}%, #E5E7EB 100%)`
              }}
            />
            
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-500">1.8</span>
              <span className="text-xs text-gray-500">5</span>
            </div>
          </div>
          
          {/* Rating Options */}
          <div className="space-y-1 mt-3">
            {ratings.map((rating) => (
              <button
                key={rating}
                onClick={() => onRatingSelect(rating)}
                className={`w-full flex items-center py-1 px-2 rounded hover:bg-gray-50 ${
                  minRating === rating ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-center">
                  {renderStars(rating)}
                </div>
                <span className="ml-2 text-sm text-gray-700">
                  {rating === 5 ? '5 Stars' : `${rating} Stars & above`}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
