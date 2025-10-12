import { ChevronRight, ChevronDown, MoreHorizontal, Edit, Trash2, Plus } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown'

interface Category {
    category_id: number
    name: string
    slug: string
    description?: string
    level: number
    is_active: boolean
    created_at: string
    updated_at: string
    children?: Category[]
    subcategories?: Subcategory[]
}

interface Subcategory {
    subcategory_id: number
    category_id?: number
    name: string
    slug: string
    description?: string
    is_active: boolean
    created_at?: string
    updated_at?: string
}

interface DashboardCategoryTreeProps {
    categories: Category[]
    maxDepth?: number
    onEditCategory?: (category: Category) => void
    onDeleteCategory?: (category: Category) => void
    onCreateSubcategory?: (category: Category) => void
    onEditSubcategory?: (subcategory: Subcategory, parentCategory: Category) => void
    onDeleteSubcategory?: (subcategory: Subcategory) => void
    className?: string
}

export default function DashboardCategoryTree({
    categories,
    maxDepth = 5,
    onEditCategory,
    onDeleteCategory,
    onCreateSubcategory,
    onEditSubcategory,
    onDeleteSubcategory,
    className = ''
}: DashboardCategoryTreeProps) {
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

    const getStatusText = (isActive: boolean) => {
        return isActive ? 'Active' : 'Inactive'
    }

    const renderCategory = (category: Category, depth: number = 0): React.ReactElement => {
        const hasChildren = (category.children && category.children.length > 0) || (category.subcategories && category.subcategories.length > 0)
        const isExpanded = expandedCategories.has(category.category_id)
        const indentLevel = depth * 20 // 20px per level

        return (
            <div key={category.category_id} className="category-tree-item">
                {/* Category Row */}
                <div
                    className="flex items-center py-3 px-4 hover:bg-gray-50 rounded-lg transition-colors border-b border-gray-100"
                    style={{ paddingLeft: `${16 + indentLevel}px` }}
                >
                    {/* Expand/Collapse Button */}
                    <button
                        onClick={() => toggleExpansion(category.category_id)}
                        className="mr-3 p-1 hover:bg-gray-200 rounded transition-colors"
                        aria-label={isExpanded ? 'Collapse category' : 'Expand category'}
                    >
                        {isExpanded ? (
                            <ChevronDown className="h-4 w-4 text-gray-500" />
                        ) : (
                            <ChevronRight className="h-4 w-4 text-gray-500" />
                        )}
                    </button>

                    {/* Category Info */}
                    <div className="flex-1 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {/* Category Icon/Indent for non-expandable items */}
                            {!hasChildren && depth > 0 && (
                                <div className="w-8 h-4 flex items-center justify-center">
                                    <div className="w-2 h-2 bg-gray-300 rounded-full" />
                                </div>
                            )}

                            <div>
                                <span className={`font-medium text-gray-900 ${depth === 0 ? 'text-base' : 'text-sm'
                                    }`}>
                                    {category.name}
                                </span>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                        {category.slug}
                                    </span>
                                    <span className={`text-xs px-2 py-1 rounded ${category.is_active
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        {getStatusText(category.is_active)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {onEditCategory && (
                                    <DropdownMenuItem onClick={() => onEditCategory(category)}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit Category
                                    </DropdownMenuItem>
                                )}
                                {onCreateSubcategory && (
                                    <DropdownMenuItem onClick={() => onCreateSubcategory(category)}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Subcategory
                                    </DropdownMenuItem>
                                )}
                                {onDeleteCategory && (
                                    <DropdownMenuItem
                                        className="text-destructive"
                                        onClick={() => onDeleteCategory(category)}
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete Category
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Children (Recursive) */}
                {hasChildren && isExpanded && depth < maxDepth - 1 && (
                    <div className="ml-2">
                        {/* Render nested categories */}
                        {category.children && category.children.map((child) =>
                            renderCategory(child, depth + 1)
                        )}
                        {/* Render subcategories (backward compatibility) */}
                        {category.subcategories && category.subcategories.map((sub) => (
                            <div key={sub.subcategory_id} className="category-tree-item">
                                <div
                                    className="flex items-center py-2 px-4 hover:bg-gray-50 rounded-lg transition-colors border-b border-gray-100"
                                    style={{ paddingLeft: `${36 + indentLevel}px` }}
                                >
                                    <div className="flex items-center gap-2 mr-3">
                                        <div className="w-2 h-2 bg-gray-300 rounded-full" />
                                    </div>

                                    <div className="flex-1 flex items-center justify-between">
                                        <div>
                                            <span className="text-sm font-medium text-gray-900">
                                                {sub.name}
                                            </span>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                                    {sub.slug}
                                                </span>
                                                <span className={`text-xs px-2 py-1 rounded ${sub.is_active
                                                    ? 'bg-blue-100 text-blue-700'
                                                    : 'bg-gray-100 text-gray-600'
                                                    }`}>
                                                    {getStatusText(sub.is_active)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Subcategory Actions */}
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-6 w-6">
                                                    <MoreHorizontal className="h-3 w-3" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                {onEditSubcategory && (
                                                    <DropdownMenuItem onClick={() => onEditSubcategory(sub, category)}>
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Edit Subcategory
                                                    </DropdownMenuItem>
                                                )}
                                                {onDeleteSubcategory && (
                                                    <DropdownMenuItem
                                                        className="text-destructive"
                                                        onClick={() => onDeleteSubcategory(sub)}
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete Subcategory
                                                    </DropdownMenuItem>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className={`dashboard-category-tree ${className}`}>
            {categories.map((category) => renderCategory(category, 0))}
        </div>
    )
}
