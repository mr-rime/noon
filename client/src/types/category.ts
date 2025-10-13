// Category types
export interface Category {
    category_id: string
    parent_id?: string
    name: string
    slug: string
    level: number
    product_count: number
    hasChildren: boolean
    children?: Category[]
}

// Hierarchical Category Filter types
export interface HierarchicalCategoryFilterProps {
    selectedCategories: string[]
    onCategoryToggle: (categoryId: string, isAllCategory: boolean) => void
    onClearAll: () => void
}

export interface CategoryItemProps {
    category: Category
    level: number
    selectedCategories: string[]
    expandedCategories: string[]
    onCategoryToggle: (categoryId: string, isAllCategory: boolean) => void
    onExpand: (categoryId: string) => void
}

// GraphQL response types
export interface GetHierarchicalCategoriesResponse {
    getHierarchicalCategories: {
        success: boolean
        categories: Category[]
    }
}
