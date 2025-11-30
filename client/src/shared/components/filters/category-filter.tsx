import { useState, useEffect } from 'react'
import { ChevronDown, ChevronRight, X } from 'lucide-react'
import { useQuery } from '@apollo/client'
import { gql } from '@apollo/client'
import { getCategoryChildren } from '@/shared/utils/category'

const GET_CATEGORY_TREE = gql`
  query GetCategoryTree($parentId: String) {
    getCategories(parentId: $parentId, includeChildren: true) {
      success
      categories {
        category_id
        parent_id
        name
        slug
        level
        product_count
        children {
          category_id
          parent_id
          name
          slug
          level
          product_count
          children {
            category_id
            parent_id
            name
            slug
            level
            product_count
            children {
              category_id
              parent_id
              name
              slug
              level
              product_count
              children {
                category_id
                parent_id
                name
                slug
                level
                product_count
            }
            }
          }
        }
      }
    }
  }
`

interface Category {
  category_id: string
  parent_id?: string
  name: string
  slug: string
  level: number
  product_count: number
  children?: Category[]
}

interface CategoryFilterProps {
  currentCategoryId?: string
  selectedCategories: string[]
  onCategoryToggle: (categoryId: string) => void
  onClear: () => void
}

function CategoryTreeItem({
  category,
  selectedCategories,
  onCategoryToggle,
  currentCategoryId,
  level = 0
}: {
  category: Category
  selectedCategories: string[]
  onCategoryToggle: (categoryId: string) => void
  currentCategoryId?: string
  level?: number
}) {
  const [expanded, setExpanded] = useState(false)
  const hasChildren = category.children !== undefined
  const isSelected = selectedCategories.includes(category.category_id)


  useEffect(() => {
    if (currentCategoryId && hasChildren) {
      const containsCurrentCategory = (cat: Category): boolean => {
        if (cat.category_id === currentCategoryId) return true
        if (cat.children) {
          return cat.children.some(child => containsCurrentCategory(child))
        }
        return false
      }

      if (containsCurrentCategory(category)) {
        setExpanded(true)
      }
    }
  }, [currentCategoryId, category, hasChildren])

  return (
    <div className={`${level > 0 ? 'ml-4' : ''}`}>
      <div className="flex items-center py-1">
        {hasChildren && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mr-1 p-0.5 hover:bg-gray-100 rounded"
          >
            {expanded ? (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronRight className="h-4 w-4 text-gray-500" />
            )}
          </button>
        )}

        <input
          type="checkbox"
          id={`category-${category.category_id}`}
          checked={isSelected}
          onChange={() => onCategoryToggle(category.category_id)}
          className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />

        <label
          htmlFor={`category-${category.category_id}`}
          className="flex-1 text-sm cursor-pointer hover:text-blue-600"
        >
          {category.name}
          {category.product_count > 0 && (
            <span className="ml-1 text-xs text-gray-500">
              ({category.product_count})
            </span>
          )}
        </label>
      </div>

      {expanded && hasChildren && (
        <div className="mt-1">
          {category.children && category.children.length > 0 ? (
            category.children.map(child => (
              <CategoryTreeItem
                key={child.category_id}
                category={child}
                selectedCategories={selectedCategories}
                onCategoryToggle={onCategoryToggle}
                currentCategoryId={currentCategoryId}
                level={level + 1}
              />
            ))
          ) : (
            <div className="ml-4 text-xs text-gray-400 italic">
              No subcategories
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function CategoryFilter({
  currentCategoryId,
  selectedCategories,
  onCategoryToggle,
  onClear
}: CategoryFilterProps) {
  const [isOpen, setIsOpen] = useState(true)

  const { data, loading } = useQuery(GET_CATEGORY_TREE, {
    variables: { parentId: null }
  })

  const categories = getCategoryChildren(data, String(currentCategoryId))
  const hasSelection = selectedCategories.length > 0

  return (
    <div className="border-b border-gray-200 pb-4">
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full text-left"
        >
          <span className="text-sm font-medium text-gray-900">Category</span>
          <ChevronDown
            className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? 'transform rotate-180' : ''
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

      {isOpen && (
        <div className="max-h-64 overflow-y-auto">
          {loading ? (
            <div className="text-sm text-gray-500">Loading...</div>
          ) : categories.length === 0 ? (
            <div className="text-sm text-gray-500">No categories available</div>
          ) : (
            categories.map((category: Category) => (
              <CategoryTreeItem
                key={category.category_id}
                category={category}
                selectedCategories={selectedCategories}
                onCategoryToggle={onCategoryToggle}
                currentCategoryId={currentCategoryId}
              />
            ))
          )}
        </div>
      )}
    </div>
  )
}
