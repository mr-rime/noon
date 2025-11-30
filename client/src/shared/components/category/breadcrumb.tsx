import { ChevronRight, Home } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { useQuery } from '@apollo/client'
import { GET_CATEGORY_BREADCRUMB } from '@/features/category/api/category'


interface BreadcrumbItem {
  id: number
  name: string
  slug: string
  level: number
}

interface BreadcrumbProps {
  categoryId?: string
  items?: BreadcrumbItem[]
  className?: string
}

export default function Breadcrumb({ categoryId, items, className = '' }: BreadcrumbProps) {
  const { data, loading } = useQuery(GET_CATEGORY_BREADCRUMB, {
    skip: !categoryId || !!items,
    variables: { categoryId }
  })

  const breadcrumbItems = items || data?.getCategoryBreadcrumb?.breadcrumb || []

  if (loading || breadcrumbItems.length === 0) return null

  return (
    <nav aria-label="Breadcrumb" className={`bg-white py-3 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ol className="flex items-center space-x-2 text-sm">
          <li>
            <Link
              to="/"
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <Home className="h-4 w-4" />
              <span className="sr-only">Home</span>
            </Link>
          </li>

          <li>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </li>

          {breadcrumbItems.map((item: BreadcrumbItem, index: number) => {
            const isLast = index === breadcrumbItems.length - 1
            const categoryPath = breadcrumbItems
              .slice(0, index + 1)
              .map((c: BreadcrumbItem) => c.slug)
              .join('/')

            return (
              <li key={item.id} className="flex items-center">
                {index > 0 && (
                  <ChevronRight className="h-4 w-4 text-gray-400 mr-2" />
                )}

                {isLast ? (
                  <Link to="/category/$"
                    params={{ _splat: categoryPath }} className="text-gray-900 font-medium">
                    {item.name}
                  </Link>
                ) : (
                  <Link
                    to="/category/$"
                    params={{ _splat: categoryPath }}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            )
          })}
        </ol>
      </div>
    </nav>
  )
}
