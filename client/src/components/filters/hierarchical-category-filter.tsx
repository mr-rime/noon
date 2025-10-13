import { useState, useEffect, useMemo } from 'react'
import { Plus, Minus } from 'lucide-react'
import { useQuery } from '@apollo/client'
import { gql } from '@apollo/client'

const GET_HIERARCHICAL_CATEGORIES = gql`
  query GetHierarchicalCategories {
    getHierarchicalCategories {
      success
      categories {
        category_id
        parent_id
        name
        slug
        level
        product_count
        hasChildren
        children {
          category_id
          parent_id
          name
          slug
          level
          product_count
          hasChildren
          children {
            category_id
            parent_id
            name
            slug
            level
            product_count
            hasChildren
            children {
              category_id
              parent_id
              name
              slug
              level
              product_count
              hasChildren
              children {
                category_id
                parent_id
                name
                slug
                level
                product_count
                hasChildren
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
  hasChildren: boolean
  children?: Category[]
}

interface HierarchicalCategoryFilterProps {
  selectedCategories: string[]
  onCategoryToggle: (categoryId: string, isAllCategory: boolean) => void
  onClearAll: () => void
}

interface CategoryItemProps {
  category: Category
  level: number
  selectedCategories: string[]
  expandedCategories: string[]
  onCategoryToggle: (categoryId: string, isAllCategory: boolean) => void
  onExpand: (categoryId: string) => void
}

function CategoryItem({
  category,
  level,
  selectedCategories,
  expandedCategories,
  onCategoryToggle,
  onExpand
}: CategoryItemProps) {
  const isExpanded = expandedCategories.includes(category.category_id)
  const hasChildren = category.hasChildren || (category.children && category.children.length > 0)
  const allCategoryId = `all_${category.category_id}`
  const isAllSelected = selectedCategories.includes(allCategoryId)

  return (
    <div className={`${level > 0 ? 'ml-2' : ''}`}>
      <div className="flex items-start py-1">
        {/* Expand/Collapse button */}
        {hasChildren && (
          <button
            onClick={() => onExpand(category.category_id)}
            className="mr-2 mt-0.5 text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            {isExpanded ? (
              <Minus className="h-3 w-3" />
            ) : (
              <Plus className="h-3 w-3" />
            )}
          </button>
        )}

        {/* Spacing for items without children */}
        {!hasChildren && level > 0 && (
          <div className="w-5 mr-2" />
        )}

        {/* Category name (clickable label) */}
        <label
          className="flex-1 text-sm cursor-pointer hover:text-blue-600 select-none"
          onClick={() => {
            if (hasChildren) {
              onExpand(category.category_id)
            }
          }}
        >
          {category.name}
        </label>
      </div>

      {/* Children section */}
      {isExpanded && hasChildren && (
        <div className="ml-5">
          {/* "All" checkbox for this category */}
          <div className="flex items-center py-1">
            <input
              type="checkbox"
              id={allCategoryId}
              checked={isAllSelected}
              onChange={() => onCategoryToggle(allCategoryId, true)}
              className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label
              htmlFor={allCategoryId}
              className="text-sm cursor-pointer hover:text-blue-600 select-none"
            >
              All {category.name}
            </label>
          </div>

          {/* Render child categories */}
          {category.children?.map(child => {
            // Check if this is a leaf category (no children)
            const isLeaf = !child.hasChildren && (!child.children || child.children.length === 0)

            if (isLeaf) {
              // Render as checkbox item
              return (
                <div key={child.category_id} className="ml-5 flex items-center py-1">
                  <input
                    type="checkbox"
                    id={`category-${child.category_id}`}
                    checked={selectedCategories.includes(child.category_id)}
                    onChange={() => onCategoryToggle(child.category_id, false)}
                    className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor={`category-${child.category_id}`}
                    className="text-sm cursor-pointer hover:text-blue-600 select-none"
                  >
                    {child.name}
                  </label>
                </div>
              )
            } else {
              // Render as expandable category
              return (
                <CategoryItem
                  key={child.category_id}
                  category={child}
                  level={level + 1}
                  selectedCategories={selectedCategories}
                  expandedCategories={expandedCategories}
                  onCategoryToggle={onCategoryToggle}
                  onExpand={onExpand}
                />
              )
            }
          })}
        </div>
      )}
    </div>
  )
}

export default function HierarchicalCategoryFilter({
  selectedCategories,
  onCategoryToggle,
  onClearAll
}: HierarchicalCategoryFilterProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])

  const { data, loading } = useQuery(GET_HIERARCHICAL_CATEGORIES)
  const categories = useMemo(() => data?.getHierarchicalCategories?.categories || [], [data])
  const hasSelection = selectedCategories.length > 0

  // Auto-expand categories that have selected children
  useEffect(() => {
    if (selectedCategories.length > 0 && categories.length > 0) {
      const toExpand: string[] = []

      // Function to check and expand parent categories
      const checkAndExpand = (cats: Category[], parentIds: string[] = []) => {
        cats.forEach(cat => {
          const hasSelectedChild = cat.children?.some(child =>
            selectedCategories.includes(child.category_id) ||
            selectedCategories.includes(`all_${child.category_id}`)
          )

          if (hasSelectedChild || selectedCategories.includes(cat.category_id) || selectedCategories.includes(`all_${cat.category_id}`)) {
            toExpand.push(...parentIds, cat.category_id)
          }

          if (cat.children) {
            checkAndExpand(cat.children, [...parentIds, cat.category_id])
          }
        })
      }

      checkAndExpand(categories)
      setExpandedCategories(prev => [...new Set([...prev, ...toExpand])])
    }
  }, [selectedCategories, categories])

  const handleExpand = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  return (
    <div className="bg-white rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-900">Category</h3>
        {hasSelection && (
          <button
            onClick={onClearAll}
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            Clear
          </button>
        )}
      </div>

      {/* Category Tree */}
      <div className="pt-3">
        {loading ? (
          <div className="text-sm text-gray-500">Loading categories...</div>
        ) : categories.length === 0 ? (
          <div className="text-sm text-gray-500">No categories available</div>
        ) : (
          <div className="max-h-96 overflow-y-auto pr-2">
            {categories.map((category: Category) => (
              <CategoryItem
                key={category.category_id}
                category={category}
                level={0}
                selectedCategories={selectedCategories}
                expandedCategories={expandedCategories}
                onCategoryToggle={onCategoryToggle}
                onExpand={handleExpand}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
