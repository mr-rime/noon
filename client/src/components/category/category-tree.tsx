import { Link } from '@tanstack/react-router'
import { ChevronRight, ChevronDown } from 'lucide-react'
import { useState } from 'react'

interface Category {
    category_id: number
    name: string
    slug: string
    description?: string
    level: number
    product_count?: number
    children?: Category[]
}

interface CategoryTreeProps {
    categories: Category[]
    currentPath: string
    isNestedPath: boolean
    basePath?: string
    maxDepth?: number
    showExpandCollapse?: boolean
    className?: string
}

export default function CategoryTree({
    categories,
    isNestedPath,
    basePath = '',
    maxDepth = 5,
    showExpandCollapse = true,
    className = ''
}: CategoryTreeProps) {
    const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set())

    const toggleExpansion = (categoryId: number) => {
        setExpandedCategories(prev => {
            const newSet = new Set(prev)
            if (newSet.has(categoryId)) {
                newSet.delete(categoryId)
            } else {
                newSet.add(categoryId)
            }
            return newSet
        })
    }

    const buildCategoryPath = (category: Category, parentPath: string = ''): string => {
        if (isNestedPath && parentPath) {
            return `${parentPath}/${category.slug}`
        }
        return category.slug
    }

    const renderCategory = (category: Category, depth: number = 0, parentPath: string = ''): React.ReactElement => {
        const hasChildren = category.children && category.children.length > 0
        const isExpanded = expandedCategories.has(category.category_id)
        const categoryPath = buildCategoryPath(category, parentPath)
        const indentLevel = depth * 16

        return (
            <div key={category.category_id} className="category-tree-item">
                {/* Category Link */}
                <div
                    className="flex items-center py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors"
                    style={{ paddingLeft: `${12 + indentLevel}px` }}
                >
                    {/* Expand/Collapse Button */}
                    {showExpandCollapse && hasChildren && (
                        <button
                            onClick={() => toggleExpansion(category.category_id)}
                            className="mr-2 p-1 hover:bg-gray-200 rounded transition-colors"
                            aria-label={isExpanded ? 'Collapse category' : 'Expand category'}
                        >
                            {isExpanded ? (
                                <ChevronDown className="h-4 w-4 text-gray-500" />
                            ) : (
                                <ChevronRight className="h-4 w-4 text-gray-500" />
                            )}
                        </button>
                    )}

                    {/* Category Link */}
                    <Link
                        to="/category/$"
                        params={{ _splat: categoryPath }}
                        className={`flex-1 flex items-center justify-between group ${depth === 0 ? 'font-medium' : 'font-normal'
                            }`}
                    >
                        <div className="flex items-center">
                            {/* Category Icon/Indent for non-expandable items */}
                            {(!showExpandCollapse || !hasChildren) && depth > 0 && (
                                <div className="w-6 h-4 flex items-center justify-center mr-2">
                                    <div className="w-2 h-2 bg-gray-300 rounded-full" />
                                </div>
                            )}

                            <span className={`text-gray-700 group-hover:text-gray-900 ${depth === 0 ? 'text-sm' : 'text-sm'
                                }`}>
                                {category.name}
                            </span>
                        </div>

                        {/* Product Count */}
                        {category.product_count !== undefined && category.product_count > 0 && (
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                {category.product_count}
                            </span>
                        )}
                    </Link>
                </div>

                {/* Children (Recursive) */}
                {hasChildren && isExpanded && depth < maxDepth - 1 && (
                    <div className="ml-2 border-l border-gray-200">
                        {category.children!.map((child) =>
                            renderCategory(child, depth + 1, categoryPath)
                        )}
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className={`category-tree ${className}`}>
            {categories.map((category) => renderCategory(category, 0, basePath))}
        </div>
    )
}


interface CategoryGridProps {
    categories: Category[]
    currentPath: string
    isNestedPath: boolean
    basePath?: string
    columns?: number
    className?: string
}

export function CategoryGrid({
    categories,
    isNestedPath,
    basePath = '',
    columns = 4,
    className = ''
}: CategoryGridProps) {
    const gridCols = {
        2: 'grid-cols-2',
        3: 'grid-cols-3',
        4: 'grid-cols-4',
        5: 'grid-cols-5',
        6: 'grid-cols-6'
    }

    const buildCategoryPath = (category: Category, parentPath: string = ''): string => {
        if (isNestedPath && parentPath) {
            return `${parentPath}/${category.slug}`
        }
        return category.slug
    }

    return (
        <div className={`grid ${gridCols[columns as keyof typeof gridCols] || 'grid-cols-4'} gap-3 ${className}`}>
            {categories.map((category) => {
                const categoryPath = buildCategoryPath(category, basePath)

                return (
                    <Link
                        key={category.category_id}
                        to="/category/$"
                        params={{ _splat: categoryPath }}
                        className="p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 transition-colors border border-gray-200 hover:border-gray-300 group"
                    >
                        <div className="font-medium group-hover:text-gray-900">{category.name}</div>
                        {category.product_count !== undefined && category.product_count > 0 && (
                            <div className="text-xs text-gray-500 mt-1">
                                {category.product_count} products
                            </div>
                        )}
                    </Link>
                )
            })}
        </div>
    )
}
