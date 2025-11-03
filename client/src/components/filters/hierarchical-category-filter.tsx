import { useState, useEffect, useMemo } from 'react'
import { useQuery } from '@apollo/client'
import { useParams } from '@tanstack/react-router'
import type { Category, HierarchicalCategoryFilterProps } from '@/types/category'
import { CategoryItem } from './components/category-item'
import { GET_HIERARCHICAL_CATEGORIES } from '@/graphql/category'




export default function HierarchicalCategoryFilter({
  selectedCategories,
  onCategoryToggle,
  rootCategoryId,
}: HierarchicalCategoryFilterProps & { rootCategoryId?: string }) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])

  const { data, loading } = useQuery(GET_HIERARCHICAL_CATEGORIES, {
    variables: { rootCategoryId, maxDepth: 5 },
  })
  const categories = useMemo(() => data?.getHierarchicalCategories?.categories || [], [data])
  const hasSelection = selectedCategories.length > 0
  const params = useParams({ from: '/(main)/_homeLayout/category/$' })
  const currentPath = (params as any)?._splat || ''

  useEffect(() => {
    if (categories.length === 0) return

    const toExpand: string[] = []

    
    if (currentPath) {
      const slugs = currentPath.split('/').filter(Boolean)
      const collect = (nodes: any[], remaining: string[]): boolean => {
        if (remaining.length === 0) return true
        const [slug, ...rest] = remaining
        const node = nodes.find(n => n.slug === slug)
        if (!node) return false
        toExpand.push(node.category_id)
        return collect(node.children || [], rest)
      }
      collect(categories, slugs)
    }

    if (selectedCategories.length > 0) {
      const parentSet = new Set<string>()
      const dfs = (node: any, path: string[]) => {
        if (selectedCategories.includes(node.category_id)) {
          path.forEach(id => parentSet.add(id))
        }
        ; (node.children || []).forEach((c: any) => dfs(c, [...path, node.category_id]))
      }
      categories.forEach((c: any) => dfs(c, []))
      toExpand.push(...Array.from(parentSet))
    }

    if (toExpand.length > 0) {
      setExpandedCategories(prev => [...new Set([...prev, ...toExpand])])
    }
  }, [selectedCategories, categories, currentPath])

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
