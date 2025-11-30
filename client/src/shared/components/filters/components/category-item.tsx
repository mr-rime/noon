import { Plus, Minus } from 'lucide-react'
import { Checkbox } from '../../ui/checkbox'
import type { CategoryItemProps } from '@/shared/types/category'
import { useParams } from '@tanstack/react-router'

export function CategoryItem({
    category,
    level,
    selectedCategories,
    expandedCategories,
    onCategoryToggle,
    onExpand
}: CategoryItemProps) {
    const isExpanded = expandedCategories.includes(category.category_id)
    const hasChildren = category.hasChildren || (category.children && category.children.length > 0)
    const params = useParams({ from: "/(main)/_homeLayout/category/$" })
    const selectedCategory = params._splat?.split("/").at(-1)

    return (
        <div className={`${level > 0 ? 'ml-2' : ''}`}>
            <div className="flex items-start py-1">
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

                {!hasChildren && level > 0 && (
                    <div className="w-5 mr-2" />
                )}

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

            {isExpanded && hasChildren && (
                <div className="ml-5">


                    {category.children?.map(child => {
                        const isLeaf = !child.hasChildren && (!child.children || child.children.length === 0)

                        if (isLeaf) {
                            return (
                                <div key={child.category_id} className="flex items-center py-1">
                                    <Checkbox
                                        id={`category-${child.category_id}`}
                                        checked={child.slug === selectedCategory}
                                        onChange={() => onCategoryToggle(child.category_id)}
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
