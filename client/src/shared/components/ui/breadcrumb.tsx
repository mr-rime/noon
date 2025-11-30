import { Link, useLocation } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import type React from 'react'
import { useMemo } from 'react'
import type { BreadcrumbProps } from '@/shared/types/ui'

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  onClick,
  separator = <ChevronRight className="h-4 w-4 text-gray-400" />,
  className = '',
}) => {
  const location = useLocation()

  const dynamicItems = useMemo(() => {
    const segments = location.pathname.split('/').filter(Boolean)

    return segments.map((segment, index) => {
      const href = '/' + segments.slice(0, index + 1).join('/')
      const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/[-_]/g, ' ')
      return { label, href }
    })
  }, [location])

  const finalItems = items ?? dynamicItems

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex items-center space-x-1 text-gray-600 text-sm">
        {finalItems.map((item, index) => {
          const isLast = index === finalItems.length - 1
          return (
            <li onClick={onClick} key={index} className="flex items-center">
              {isLast ? (
                <span className="font-medium text-gray-800">{item.label}</span>
              ) : (
                <Link to={item.href!} className="text-blue-600 hover:underline">
                  {item.label}
                </Link>
              )}
              {!isLast && <span className="mx-2">{separator}</span>}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
