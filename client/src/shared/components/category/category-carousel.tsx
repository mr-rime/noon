import { useQuery } from '@apollo/client'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { gql } from '@apollo/client'

const GET_ROOT_CATEGORIES = gql`
  query GetRootCategories {
    getCategories(parentId: null, includeChildren: false) {
      success
      message
      categories {
        category_id
        name
        slug
        icon_url
        image_url
        product_count
      }
    }
  }
`

interface Category {
  category_id: number
  name: string
  slug: string
  icon_url?: string
  image_url?: string
  product_count: number
}

export default function CategoryCarousel() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)

  const { data, loading, error } = useQuery(GET_ROOT_CATEGORIES)

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setShowLeftArrow(scrollLeft > 0)
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200
      const currentScroll = scrollContainerRef.current.scrollLeft
      const newScroll = direction === 'left'
        ? currentScroll - scrollAmount
        : currentScroll + scrollAmount

      scrollContainerRef.current.scrollTo({
        left: newScroll,
        behavior: 'smooth'
      })
    }
  }

  if (loading) return null
  if (error) return null
  if (!data?.getCategories?.success) return null

  const categories = data.getCategories.categories || []

  return (
    <div className="bg-[#fcfbf4] border-b border-[#e2e5f1] relative top-0 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          {showLeftArrow && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-1 hover:shadow-lg transition-shadow"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}

          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex gap-6 overflow-x-auto scrollbar-hide py-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {categories.map((category: Category) => (
              <Link
                key={category.category_id}
                to="/category/$"
                params={{ _splat: category.slug }}
                className="flex flex-col items-center min-w-[80px] group"
              >
                <span className="mt-2 text-[16px] font-bold text-center text-black hover:underline group-hover:text-gray-900">
                  {category.name}
                </span>
                {category.product_count > 0 && (
                  <span className="text-xs text-gray-500">
                    ({category.product_count})
                  </span>
                )}
              </Link>
            ))}
          </div>

          {showRightArrow && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-1 hover:shadow-lg transition-shadow"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
