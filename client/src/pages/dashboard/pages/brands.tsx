import { useState, useEffect } from "react"
import { useMutation, useQuery } from "@apollo/client"
import {
    Search,
    Plus,
    MoreHorizontal,
    Edit,
    Trash2,
    Building,
    Grid3X3,
    List,
    Loader2,
    AlertCircle,
    Package
} from "lucide-react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Badge } from "../components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown"
import { BrandEditModal } from "../components/brands/brand-edit-modal"
import { DeleteConfirmationModal } from "../components/ui/delete-confirmation-modal"
import { toast } from "sonner"
import { DELETE_BRAND, GET_BRANDS } from "@/graphql/brand"

interface Brand {
    brand_id: number
    name: string
    slug: string
    description?: string
    logo_url?: string
    is_active: boolean
    created_at: string
    updated_at: string
}

export default function Brands() {
    const [searchTerm, setSearchTerm] = useState("")
    const [searchQuery, setSearchQuery] = useState("")
    const [editingBrand, setEditingBrand] = useState<Brand | null>(null)
    const [isCreatingBrand, setIsCreatingBrand] = useState(false)
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
    const [deleteModal, setDeleteModal] = useState<{
        isOpen: boolean
        brand: Brand | null
    }>({
        isOpen: false,
        brand: null
    })

    // Fetch brands
    const { data, loading, error, refetch } = useQuery(GET_BRANDS, {
        variables: {
            search: searchQuery
        },
        fetchPolicy: 'cache-and-network'
    })

    // Delete brand mutation
    const [deleteBrandMutation, { loading: deleting }] = useMutation(DELETE_BRAND, {
        onCompleted: (data) => {
            if (data.deleteBrand.success) {
                toast.success(data.deleteBrand.message || 'Brand deleted successfully')
                refetch()
            } else {
                toast.error(data.deleteBrand.message || 'Failed to delete brand')
            }
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete brand')
        }
    })

    const brands = data?.getBrands?.brands || []

    // Handle search with debouncing
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchQuery(searchTerm)
        }, 500)

        return () => clearTimeout(timer)
    }, [searchTerm])

    const handleEditBrand = (brand: Brand) => {
        setEditingBrand(brand)
    }

    const handleDeleteBrand = (brand: Brand) => {
        setDeleteModal({
            isOpen: true,
            brand
        })
    }

    const handleConfirmDelete = async () => {
        if (!deleteModal.brand) return

        await deleteBrandMutation({
            variables: {
                id: deleteModal.brand.brand_id
            }
        })

        setDeleteModal({ isOpen: false, brand: null })
    }

    const handleCloseDeleteModal = () => {
        setDeleteModal({ isOpen: false, brand: null })
    }

    const handleModalClose = () => {
        setEditingBrand(null)
        setIsCreatingBrand(false)
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
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground">Brand Management</h1>
                    <p className="text-sm md:text-base text-muted-foreground">Manage your product brands and manufacturers</p>
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
                        onClick={() => setIsCreatingBrand(true)}
                    >
                        <Plus className="h-4 w-4" />
                        Add Brand
                    </Button>
                </div>
            </div>

            {/* Search Bar */}
            <Card className="shadow-card">
                <CardContent className="pt-6">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search brands..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Brands Display */}
            <Card className="shadow-card">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                        <Building className="h-5 w-5 text-primary" />
                        Brands ({brands.length})
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
                            <p className="text-muted-foreground">Failed to load brands</p>
                            <Button onClick={() => refetch()} variant="outline">Retry</Button>
                        </div>
                    ) : brands.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-4">
                            <Building className="h-12 w-12 text-muted-foreground" />
                            <p className="text-muted-foreground">No brands found</p>
                            <Button onClick={() => setIsCreatingBrand(true)} variant="outline">
                                <Plus className="h-4 w-4 mr-2" />
                                Create First Brand
                            </Button>
                        </div>
                    ) : viewMode === 'list' ? (
                        /* List View */
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Logo</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead className="hidden md:table-cell">Slug</TableHead>
                                        <TableHead className="hidden lg:table-cell">Description</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="hidden md:table-cell">Created</TableHead>
                                        <TableHead className="w-[50px]">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {brands.map((brand: Brand) => (
                                        <TableRow key={brand.brand_id} className="hover:bg-muted/30">
                                            <TableCell>
                                                <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                                                    {brand.logo_url ? (
                                                        <img
                                                            src={brand.logo_url}
                                                            alt={brand.name}
                                                            className="h-8 w-8 object-contain"
                                                            onError={(e) => {
                                                                e.currentTarget.style.display = 'none'
                                                                e.currentTarget.parentElement?.classList.add('after:content-[attr(data-letter)]')
                                                                e.currentTarget.parentElement?.setAttribute('data-letter', brand.name[0].toUpperCase())
                                                            }}
                                                        />
                                                    ) : (
                                                        <span className="text-sm font-semibold text-muted-foreground">
                                                            {brand.name[0].toUpperCase()}
                                                        </span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium">{brand.name}</div>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                <code className="text-xs bg-muted px-2 py-1 rounded">{brand.slug}</code>
                                            </TableCell>
                                            <TableCell className="hidden lg:table-cell">
                                                <span className="text-sm text-muted-foreground truncate max-w-[200px] inline-block">
                                                    {brand.description || '—'}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={getStatusVariant(brand.is_active)}>
                                                    {getStatusText(brand.is_active)}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                                                {new Date(brand.created_at).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" disabled={deleting}>
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => handleEditBrand(brand)}>
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Edit Brand
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => {
                                                            // TODO: View products for this brand
                                                            toast.info("View products coming soon")
                                                        }}>
                                                            <Package className="mr-2 h-4 w-4" />
                                                            View Products
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="text-destructive"
                                                            onClick={() => handleDeleteBrand(brand)}
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        /* Grid View */
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
                            {brands.map((brand: Brand) => (
                                <Card key={brand.brand_id} className="relative overflow-hidden hover:shadow-lg transition-shadow">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                                                    {brand.logo_url ? (
                                                        <img
                                                            src={brand.logo_url}
                                                            alt={brand.name}
                                                            className="h-10 w-10 object-contain"
                                                            onError={(e) => {
                                                                e.currentTarget.style.display = 'none'
                                                                e.currentTarget.parentElement?.classList.add('text-lg', 'font-semibold')
                                                                // e.currentTarget.parentElement?.innerHTML = brand.name[0].toUpperCase()
                                                            }}
                                                        />
                                                    ) : (
                                                        <span className="text-lg font-semibold text-muted-foreground">
                                                            {brand.name[0].toUpperCase()}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <CardTitle className="text-base">{brand.name}</CardTitle>
                                                    <code className="text-xs bg-muted px-2 py-1 rounded inline-block mt-1">
                                                        {brand.slug}
                                                    </code>
                                                </div>
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handleEditBrand(brand)}>
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => {
                                                        toast.info("View products coming soon")
                                                    }}>
                                                        <Package className="mr-2 h-4 w-4" />
                                                        View Products
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="text-destructive"
                                                        onClick={() => handleDeleteBrand(brand)}
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                            {brand.description || 'No description available'}
                                        </p>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <Badge variant={getStatusVariant(brand.is_active)}>
                                                {getStatusText(brand.is_active)}
                                            </Badge>
                                            <span className="text-xs text-muted-foreground">
                                                Created {new Date(brand.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Modals */}
            {(editingBrand || isCreatingBrand) && (
                <BrandEditModal
                    brand={editingBrand}
                    isCreating={isCreatingBrand}
                    onClose={handleModalClose}
                    onSave={handleModalSave}
                />
            )}

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={handleCloseDeleteModal}
                onConfirm={handleConfirmDelete}
                title="Delete Brand"
                description="Are you sure you want to delete this brand? This action cannot be undone."
                itemName={deleteModal.brand?.name}
                isLoading={deleting}
                warningMessage="Make sure no products are using this brand before deletion."
            />
        </div>
    )
}
