import { useState, useEffect, useMemo } from 'react'
import { useQuery } from '@apollo/client'
import { gql } from '@apollo/client'
import type { Category, HierarchicalCategoryFilterProps } from '@/types/category'
import { CategoryItem } from './components/category-item'

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
