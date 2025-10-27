import { useState, useEffect, useMemo } from 'react'
import { useQuery } from '@apollo/client'
import type { Category, HierarchicalCategoryFilterProps } from '@/types/category'
import { CategoryItem } from './components/category-item'
import { GET_HIERARCHICAL_CATEGORIES } from '@/graphql/category'




export default function HierarchicalCategoryFilter({
  selectedCategories,
  onCategoryToggle,
}: HierarchicalCategoryFilterProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])

  const { data, loading } = useQuery(GET_HIERARCHICAL_CATEGORIES)
  const categories = useMemo(() => data?.getHierarchicalCategories?.categories || [], [data])
  const hasSelection = selectedCategories.length > 0

  useEffect(() => {
    if (selectedCategories.length > 0 && categories.length > 0) {
      const toExpand: string[] = []



















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
