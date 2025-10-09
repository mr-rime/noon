import { useState, useEffect } from "react"
import { useMutation, useQuery } from "@apollo/client"
import {
    Search,
    Plus,
    MoreHorizontal,
    Edit,
    Trash2,
    Folder,
    FolderOpen,
    ChevronRight,
    ChevronDown,
    Loader2,
    AlertCircle,
    Grid3X3,
    List
} from "lucide-react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Badge } from "../components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown"
import { CategoryEditModal } from "../components/categories/category-edit-modal"
import { GET_CATEGORIES, DELETE_CATEGORY, DELETE_SUBCATEGORY } from "../../../graphql/category"
import { toast } from "sonner"
import { SubcategoryEditModal } from "../components/categories/subcategory-edit-modal"
import { DeleteConfirmationModal } from "../components/ui/delete-confirmation-modal"

interface Category {
    category_id: number
    name: string
    slug: string
    description?: string
    is_active: boolean
    created_at: string
    updated_at: string
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

export default function Categories() {
    const [searchTerm, setSearchTerm] = useState("")
    const [searchQuery, setSearchQuery] = useState("")
    const [editingCategory, setEditingCategory] = useState<Category | null>(null)
    const [editingSubcategory, setEditingSubcategory] = useState<{ subcategory: Subcategory | null, parentCategory: Category | null }>({ subcategory: null, parentCategory: null })
    const [isCreatingCategory, setIsCreatingCategory] = useState(false)
    const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set())
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
    const [deleteModal, setDeleteModal] = useState<{
        isOpen: boolean
        type: 'category' | 'subcategory'
        item: Category | Subcategory | null
    }>({
        isOpen: false,
        type: 'category',
        item: null
    })

    // Fetch categories
    const { data, loading, error, refetch } = useQuery(GET_CATEGORIES, {
        variables: {
            search: searchQuery
        },
        fetchPolicy: 'cache-and-network'
    })

    // Delete category mutation
    const [deleteCategoryMutation, { loading: deletingCategory }] = useMutation(DELETE_CATEGORY, {
        onCompleted: (data) => {
            if (data.deleteCategory.success) {
                toast.success(data.deleteCategory.message || 'Category deleted successfully')
                refetch()
            } else {
                toast.error(data.deleteCategory.message || 'Failed to delete category')
            }
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete category')
        }
    })

    // Delete subcategory mutation
    const [deleteSubcategoryMutation, { loading: deletingSubcategory }] = useMutation(DELETE_SUBCATEGORY, {
        onCompleted: (data) => {
            if (data.deleteSubcategory.success) {
                toast.success(data.deleteSubcategory.message || 'Subcategory deleted successfully')
                refetch()
            } else {
                toast.error(data.deleteSubcategory.message || 'Failed to delete subcategory')
            }
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete subcategory')
        }
    })

    const categories = data?.getCategories?.categories || []

    // Handle search with debouncing
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchQuery(searchTerm)
        }, 500)

        return () => clearTimeout(timer)
    }, [searchTerm])

    const toggleCategoryExpansion = (categoryId: number) => {
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

    const handleEditCategory = (category: Category) => {
        setEditingCategory(category)
    }

    const handleEditSubcategory = (subcategory: Subcategory, parentCategory: Category) => {
        setEditingSubcategory({ subcategory, parentCategory })
    }

    const handleCreateSubcategory = (parentCategory: Category) => {
        setEditingSubcategory({ subcategory: null, parentCategory })
    }

    const handleDeleteCategory = (category: Category) => {
        if (category.subcategories && category.subcategories.length > 0) {
            toast.error('Cannot delete category with subcategories. Please delete all subcategories first.')
            return
        }
        
        setDeleteModal({
            isOpen: true,
            type: 'category',
            item: category
        })
    }

    const handleDeleteSubcategory = (subcategory: Subcategory) => {
        setDeleteModal({
            isOpen: true,
            type: 'subcategory',
            item: subcategory
        })
    }

    const handleConfirmDelete = async () => {
        if (!deleteModal.item) return

        if (deleteModal.type === 'category') {
            await deleteCategoryMutation({ variables: { id: (deleteModal.item as Category).category_id } })
        } else {
            await deleteSubcategoryMutation({ variables: { id: (deleteModal.item as Subcategory).subcategory_id } })
        }

        setDeleteModal({ isOpen: false, type: 'category', item: null })
    }

    const handleCloseDeleteModal = () => {
        setDeleteModal({ isOpen: false, type: 'category', item: null })
    }

    const handleModalClose = () => {
        setEditingCategory(null)
        setEditingSubcategory({ subcategory: null, parentCategory: null })
        setIsCreatingCategory(false)
    }

    const handleModalSave = () => {
        handleModalClose()
        refetch()
    }

    const getStatusVariant = (isActive: boolean) => {
        return isActive ? "default" : "secondary"
    }

    const getStatusText = (isActive: boolean) => {
        return isActive ? "Active" : "Inactive"
    }

    return (
        <div className="space-y-4 md:space-y-6 p-4 md:p-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground">Categories Management</h1>
                    <p className="text-sm md:text-base text-muted-foreground">Organize your product categories and subcategories</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
                        className="hidden md:flex"
                    >
                        {viewMode === 'list' ? <Grid3X3 className="h-4 w-4" /> : <List className="h-4 w-4" />}
                    </Button>
                    <Button
                        variant="admin"
                        className="gap-2"
                        onClick={() => setIsCreatingCategory(true)}
                    >
                        <Plus className="h-4 w-4" />
                        Add Category
                    </Button>
                </div>
            </div>

            {/* Search Bar */}
            <Card className="shadow-card">
                <CardContent className="pt-6">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search categories or subcategories..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Categories Display */}
            <Card className="shadow-card">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                        <Folder className="h-5 w-5 text-primary" />
                        Categories ({categories.length})
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0 md:p-6">
                    {loading && !data ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-4">
                            <AlertCircle className="h-12 w-12 text-destructive" />
                            <p className="text-muted-foreground">Failed to load categories</p>
                            <Button onClick={() => refetch()} variant="outline">Retry</Button>
                        </div>
                    ) : categories.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-4">
                            <Folder className="h-12 w-12 text-muted-foreground" />
                            <p className="text-muted-foreground">No categories found</p>
                            <Button onClick={() => setIsCreatingCategory(true)} variant="outline">
                                <Plus className="h-4 w-4 mr-2" />
                                Create First Category
                            </Button>
                        </div>
                    ) : viewMode === 'list' ? (
                        /* List View */
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[40px]"></TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead className="hidden md:table-cell">Slug</TableHead>
                                        <TableHead className="hidden lg:table-cell">Description</TableHead>
                                        <TableHead>Subcategories</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="hidden md:table-cell">Created</TableHead>
                                        <TableHead className="w-[50px]">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {categories.map((category: Category) => {
                                        const isExpanded = expandedCategories.has(category.category_id)
                                        const subcategoryCount = category.subcategories?.length || 0

                                        return (
                                            <>
                                                <TableRow key={`cat-${category.category_id}`} className="hover:bg-muted/30">
                                                    <TableCell>
                                                        {subcategoryCount > 0 && (
                                                            <button
                                                                onClick={() => toggleCategoryExpansion(category.category_id)}
                                                                className="p-1 hover:bg-muted rounded"
                                                            >
                                                                {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                                            </button>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            {isExpanded ? <FolderOpen className="h-4 w-4 text-primary" /> : <Folder className="h-4 w-4 text-primary" />}
                                                            <span className="font-medium">{category.name}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="hidden md:table-cell">
                                                        <code className="text-xs bg-muted px-2 py-1 rounded">{category.slug}</code>
                                                    </TableCell>
                                                    <TableCell className="hidden lg:table-cell">
                                                        <span className="text-sm text-muted-foreground truncate max-w-[200px] inline-block">
                                                            {category.description || '—'}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline">
                                                            {subcategoryCount} subcategories
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant={getStatusVariant(category.is_active)}>
                                                            {getStatusText(category.is_active)}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                                                        {new Date(category.created_at).toLocaleDateString()}
                                                    </TableCell>
                                                    <TableCell>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon" disabled={deletingCategory || deletingSubcategory}>
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem onClick={() => handleEditCategory(category)}>
                                                                    <Edit className="mr-2 h-4 w-4" />
                                                                    Edit Category
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => handleCreateSubcategory(category)}>
                                                                    <Plus className="mr-2 h-4 w-4" />
                                                                    Add Subcategory
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    className="text-destructive"
                                                                    onClick={() => handleDeleteCategory(category)}
                                                                >
                                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                                    Delete
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                                {/* Subcategories */}
                                                {isExpanded && category.subcategories?.map((subcategory: Subcategory) => (
                                                    <TableRow key={`sub-${subcategory.subcategory_id}`} className="bg-muted/10">
                                                        <TableCell></TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center gap-2 pl-6">
                                                                <span className="text-muted-foreground">└</span>
                                                                <span>{subcategory.name}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="hidden md:table-cell">
                                                            <code className="text-xs bg-muted px-2 py-1 rounded">{subcategory.slug}</code>
                                                        </TableCell>
                                                        <TableCell className="hidden lg:table-cell">
                                                            <span className="text-sm text-muted-foreground truncate max-w-[200px] inline-block">
                                                                {subcategory.description || '—'}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell>—</TableCell>
                                                        <TableCell>
                                                            <Badge variant={getStatusVariant(subcategory.is_active)}>
                                                                {getStatusText(subcategory.is_active)}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                                                            —
                                                        </TableCell>
                                                        <TableCell>
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button variant="ghost" size="icon" disabled={deletingSubcategory}>
                                                                        <MoreHorizontal className="h-4 w-4" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end">
                                                                    <DropdownMenuItem onClick={() => handleEditSubcategory(subcategory, category)}>
                                                                        <Edit className="mr-2 h-4 w-4" />
                                                                        Edit Subcategory
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem
                                                                        className="text-destructive"
                                                                        onClick={() => handleDeleteSubcategory(subcategory)}
                                                                    >
                                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                                        Delete
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        /* Grid View */
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                            {categories.map((category: Category) => {
                                const subcategoryCount = category.subcategories?.length || 0

                                return (
                                    <Card key={category.category_id} className="relative overflow-hidden hover:shadow-lg transition-shadow">
                                        <CardHeader className="pb-3">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Folder className="h-5 w-5 text-primary" />
                                                    <CardTitle className="text-base">{category.name}</CardTitle>
                                                </div>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => handleEditCategory(category)}>
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleCreateSubcategory(category)}>
                                                            <Plus className="mr-2 h-4 w-4" />
                                                            Add Subcategory
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="text-destructive"
                                                            onClick={() => handleDeleteCategory(category)}
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                            <code className="text-xs bg-muted px-2 py-1 rounded inline-block mt-2">{category.slug}</code>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm text-muted-foreground mb-3">
                                                {category.description || 'No description'}
                                            </p>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <Badge variant="outline">
                                                    {subcategoryCount} subcategories
                                                </Badge>
                                                <Badge variant={getStatusVariant(category.is_active)}>
                                                    {getStatusText(category.is_active)}
                                                </Badge>
                                            </div>
                                            {subcategoryCount > 0 && (
                                                <div className="mt-4 pt-4 border-t">
                                                    <p className="text-xs font-medium text-muted-foreground mb-2">Subcategories:</p>
                                                    <div className="flex flex-wrap gap-1">
                                                        {category.subcategories?.slice(0, 3).map((sub: Subcategory) => (
                                                            <Badge key={sub.subcategory_id} variant="secondary" className="text-xs">
                                                                {sub.name}
                                                            </Badge>
                                                        ))}
                                                        {subcategoryCount > 3 && (
                                                            <Badge variant="outline" className="text-xs">
                                                                +{subcategoryCount - 3} more
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                )
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Modals */}
            {(editingCategory || isCreatingCategory) && (
                <CategoryEditModal
                    category={editingCategory}
                    isCreating={isCreatingCategory}
                    onClose={handleModalClose}
                    onSave={handleModalSave}
                />
            )}

            {(editingSubcategory.subcategory !== null || editingSubcategory.parentCategory !== null) && (
                <SubcategoryEditModal
                    subcategory={editingSubcategory.subcategory}
                    parentCategory={editingSubcategory.parentCategory!}
                    onClose={handleModalClose}
                    onSave={handleModalSave}
                />
            )}

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={handleCloseDeleteModal}
                onConfirm={handleConfirmDelete}
                title={`Delete ${deleteModal.type === 'category' ? 'Category' : 'Subcategory'}`}
                description={`Are you sure you want to delete this ${deleteModal.type}? This action cannot be undone.`}
                itemName={deleteModal.item?.name}
                isLoading={deletingCategory || deletingSubcategory}
                warningMessage={
                    deleteModal.type === 'category' && deleteModal.item && (deleteModal.item as Category).subcategories && (deleteModal.item as Category).subcategories!.length > 0
                        ? 'This category contains subcategories. Please delete all subcategories first.'
                        : undefined
                }
            />
        </div>
    )
}
