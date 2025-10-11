import { useState, useEffect } from "react"
import { ChevronRight, ChevronDown, Folder, FolderOpen } from "lucide-react"
import { Badge } from "../ui/badge"
import { cn } from "@/utils/cn"

interface Category {
    category_id: number
    parent_id?: number
    name: string
    slug: string
    description?: string
    level: number
    path: string
    is_active: boolean
    children?: Category[]
    subcategories?: Subcategory[] // For backward compatibility
}

interface Subcategory {
    subcategory_id: number
    category_id: number
    name: string
    slug: string
    description?: string
    is_active: boolean
}

interface NestedCategorySelectorProps {
    categories: Category[]
    selectedCategory?: Category | null
    onCategorySelect: (category: Category) => void
    className?: string
}

interface CategoryItemProps {
    category: Category
    selectedCategory?: Category | null
    onCategorySelect: (category: Category) => void
    level: number
    isExpanded: boolean
    onToggleExpanded: (categoryId: number) => void
    expandedCategories: Set<number>
}

function CategoryItem({
    category,
    selectedCategory,
    onCategorySelect,
    level,
    isExpanded,
    onToggleExpanded,
    expandedCategories
}: CategoryItemProps) {
    const hasChildren = (category.children && category.children.length > 0) ||
        (category.subcategories && category.subcategories.length > 0)
    const isSelected = selectedCategory?.category_id === category.category_id
    const indentLevel = level * 20

    const handleClick = () => {
        onCategorySelect(category)
    }

    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation()
        onToggleExpanded(category.category_id)
    }

    return (
        <div className="select-none">
            <div
                className={cn(
                    "flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors",
                    "hover:bg-muted/50",
                    isSelected && "bg-primary/10 text-primary font-medium"
                )}
                style={{ paddingLeft: `${8 + indentLevel}px` }}
                onClick={handleClick}
            >
                {hasChildren && (
                    <button
                        className="h-4 w-4 p-0 hover:bg-transparent flex items-center justify-center"
                        onClick={handleToggle}
                    >
                        {isExpanded ? (
                            <ChevronDown className="h-3 w-3" />
                        ) : (
                            <ChevronRight className="h-3 w-3" />
                        )}
                    </button>
                )}

                {!hasChildren && (
                    <div className="w-4 h-4" /> // Spacer for alignment
                )}

                <div className="flex items-center gap-2 flex-1">
                    {isSelected ? (
                        <FolderOpen className="h-4 w-4 text-primary" />
                    ) : (
                        <Folder className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="text-sm">{category.name}</span>
                </div>

                {isSelected && (
                    <Badge variant="secondary" className="text-xs">
                        Selected
                    </Badge>
                )}
            </div>

            {hasChildren && isExpanded && (
                <div>
                    {/* Render children from nested structure recursively */}
                    {category.children?.map((child) => (
                        <CategoryItem
                            key={child.category_id}
                            category={child}
                            selectedCategory={selectedCategory}
                            onCategorySelect={onCategorySelect}
                            level={level + 1}
                            isExpanded={expandedCategories.has(child.category_id)}
                            onToggleExpanded={onToggleExpanded}
                            expandedCategories={expandedCategories}
                        />
                    ))}

                    {/* Render subcategories for backward compatibility */}
                    {category.subcategories?.map((subcategory) => (
                        <div
                            key={subcategory.subcategory_id}
                            className={cn(
                                "flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors",
                                "hover:bg-muted/50",
                                selectedCategory?.category_id === subcategory.subcategory_id &&
                                "bg-primary/10 text-primary font-medium"
                            )}
                            style={{ paddingLeft: `${8 + (level + 1) * 20}px` }}
                            onClick={() => onCategorySelect({
                                ...subcategory,
                                category_id: subcategory.subcategory_id,
                                parent_id: category.category_id,
                                level: level + 1,
                                path: `${category.path}${subcategory.subcategory_id}/`,
                                children: []
                            })}
                        >
                            <Folder className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{subcategory.name}</span>
                            {selectedCategory?.category_id === subcategory.subcategory_id && (
                                <Badge variant="secondary" className="text-xs">
                                    Selected
                                </Badge>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export function NestedCategorySelector({
    categories,
    selectedCategory,
    onCategorySelect,
    className
}: NestedCategorySelectorProps) {
    const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set())

    // Expand root categories by default when categories change
    useEffect(() => {
        if (categories.length > 0) {
            const rootCategoryIds = categories.map(cat => cat.category_id)
            setExpandedCategories(new Set(rootCategoryIds))
            // Debug: Log the categories structure
            console.log('Categories loaded:', categories)
        }
    }, [categories])

    const toggleExpanded = (categoryId: number) => {
        const newExpanded = new Set(expandedCategories)
        if (newExpanded.has(categoryId)) {
            newExpanded.delete(categoryId)
        } else {
            newExpanded.add(categoryId)
        }
        setExpandedCategories(newExpanded)
    }

    const getCategoryPath = (selectedCategory: Category): string => {
        if (!selectedCategory) return ""

        // Build path from root to selected category
        const pathParts: string[] = []
        const current = selectedCategory

        // For now, we'll build a simple path
        // In a full implementation, you'd traverse up the tree
        pathParts.push(current.name)

        return pathParts.join(" → ")
    }

    return (
        <div className={cn("space-y-4", className)}>
            <div className="border rounded-lg max-h-96 overflow-y-auto">
                {categories.map((category) => (
                    <CategoryItem
                        key={category.category_id}
                        category={category}
                        selectedCategory={selectedCategory}
                        onCategorySelect={onCategorySelect}
                        level={0}
                        isExpanded={expandedCategories.has(category.category_id)}
                        onToggleExpanded={toggleExpanded}
                        expandedCategories={expandedCategories}
                    />
                ))}
            </div>

            {selectedCategory && (
                <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                    <h4 className="font-medium text-primary mb-1">Selected Category:</h4>
                    <p className="text-sm text-primary/80">
                        {getCategoryPath(selectedCategory)}
                    </p>
                    {selectedCategory.description && (
                        <p className="text-xs text-muted-foreground mt-1">
                            {selectedCategory.description}
                        </p>
                    )}
                </div>
            )}
        </div>
    )
}
