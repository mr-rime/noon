import type { Category } from "@/types";

export function findCategoryById(categories: Category[], id: string): Category | null {
    for (const category of categories || []) {
        if (category.category_id === id) {
            return category;
        }

        if (category.children && category.children.length > 0) {
            const found = findCategoryById(category.children, id);
            if (found) return found;
        }
    }
    return null;
}

export function getCategoryChildren(data: any, currentCategoryId: string) {
    const allCategories = data?.getCategories?.categories || []
    if (!currentCategoryId) return allCategories

    const found = findCategoryById(allCategories, currentCategoryId)
    if (found && found.children) return found.children

    return []
}