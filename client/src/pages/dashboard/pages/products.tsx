import { useState, useEffect } from "react"
import { useMutation, useQuery } from "@apollo/client"
import {
    Search,
    Plus,
    MoreHorizontal,
    Edit,
    Eye,
    Trash2,
    Package,
    Loader2,
    AlertCircle
} from "lucide-react"
import { Button } from "../components/ui/button"
import { useNavigate } from "@tanstack/react-router"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Badge } from "../components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown"
import { ProductViewDetails } from "../components/products/product-view-details"
import { ProductEditForm } from "../components/products/product-edit-form"
import { ProductFilters } from "../components/products/product-filters"
import { Pagination } from "../components/ui/pagination"
import { GET_PRODUCTS, DELETE_PRODUCT } from "../../../graphql/product"
import { toast } from "sonner"
import { DeleteConfirmationModal } from "../components/ui/delete-confirmation-modal"

const ITEMS_PER_PAGE = 10

export default function Products() {
    const navigate = useNavigate()
    const [searchTerm, setSearchTerm] = useState("")
    const [searchQuery, setSearchQuery] = useState("")
    const [viewingProduct, setViewingProduct] = useState<string | null>(null)
    const [editingProduct, setEditingProduct] = useState<string | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [filters, setFilters] = useState({
        status: [] as string[],
        category: [] as string[],
        stockLevel: [] as string[]
    })
    const [deleteModal, setDeleteModal] = useState<{
        isOpen: boolean
        productId: string | null
        productName: string | null
    }>({
        isOpen: false,
        productId: null,
        productName: null
    })

    // Fetch products with pagination
    const { data, loading, error, refetch } = useQuery(GET_PRODUCTS, {
        variables: {
            limit: ITEMS_PER_PAGE,
            offset: (currentPage - 1) * ITEMS_PER_PAGE,
            search: searchQuery
        },
        fetchPolicy: 'cache-and-network'
    })

    // Delete product mutation
    const [deleteProductMutation, { loading: deleting }] = useMutation(DELETE_PRODUCT, {
        onCompleted: (data) => {
            if (data.deleteProduct.success) {
                toast.success(data.deleteProduct.message || 'Product deleted successfully')
                refetch()
            } else {
                toast.error(data.deleteProduct.message || 'Failed to delete product')
            }
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete product')
        }
    })

    const products = data?.getProducts?.products || []
    const total = data?.getProducts?.total || 0
    const totalPages = Math.ceil(total / ITEMS_PER_PAGE)

    // Handle search with debouncing
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchQuery(searchTerm)
            setCurrentPage(1)
        }, 500)

        return () => clearTimeout(timer)
    }, [searchTerm])

    const filteredProducts = products.filter((product: any) => {
        // Stock level filter
        let matchesStockLevel = true
        if (filters.stockLevel.length > 0) {
            const stock = parseInt(product.stock) || 0
            matchesStockLevel = filters.stockLevel.some(level => {
                switch (level) {
                    case "in-stock":
                        return stock > 20
                    case "low-stock":
                        return stock > 0 && stock <= 20
                    case "out-of-stock":
                        return stock === 0
                    default:
                        return true
                }
            })
        }

        return matchesStockLevel
    })

    const getStatusVariant = (status: string) => {
        switch (status) {
            case "Active": return "default"
            case "Out of Stock": return "destructive"
            case "Draft": return "secondary"
            default: return "secondary"
        }
    }

    const getStockColor = (stock: number) => {
        if (stock === 0) return "text-destructive"
        if (stock < 20) return "text-warning"
        return "text-success"
    }

    const handleViewProduct = (productId: string) => {
        setViewingProduct(productId)
    }

    const handleEditProduct = (productId: string) => {
        setEditingProduct(productId)
        setViewingProduct(null)
    }

    const handleCloseModals = () => {
        setViewingProduct(null)
        setEditingProduct(null)
    }

    const handleSaveProduct = () => {
        setEditingProduct(null)
        refetch()
    }

    const handleDeleteProduct = (productId: string, productName: string) => {
        setDeleteModal({
            isOpen: true,
            productId,
            productName
        })
    }

    const handleConfirmDelete = async () => {
        if (!deleteModal.productId) return
        
        await deleteProductMutation({ variables: { id: deleteModal.productId } })
        setDeleteModal({ isOpen: false, productId: null, productName: null })
    }

    const handleCloseDeleteModal = () => {
        setDeleteModal({ isOpen: false, productId: null, productName: null })
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const getStockStatus = (stock: number) => {
        if (stock < 20) return "Low Stock"
        return "In Stock"
    }

    return (
        <div className="space-y-4 md:space-y-6 p-4 md:p-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground">Products Management</h1>
                    <p className="text-sm md:text-base text-muted-foreground">Manage your product catalog and inventory</p>
                </div>
                <Button
                    variant="admin"
                    className="gap-2 w-full sm:w-auto"
                    onClick={() => navigate({ to: "/d/products/new" })}
                >
                    <Plus className="h-4 w-4" />
                    Add New Product
                </Button>
            </div>

            {/* Filters and Search */}
            <Card className="shadow-card">
                <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search products by name or SKU..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <ProductFilters onFiltersChange={setFilters} />
                    </div>
                </CardContent>
            </Card>

            {/* Products Table */}
            <Card className="shadow-card">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                        <Package className="h-5 w-5 text-primary" />
                        All Products ({total})
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
                            <p className="text-muted-foreground">Failed to load products</p>
                            <Button onClick={() => refetch()} variant="outline">Retry</Button>
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-4">
                            <Package className="h-12 w-12 text-muted-foreground" />
                            <p className="text-muted-foreground">No products found</p>
                        </div>
                    ) : (
                        <>
                            {/* Desktop Table View */}
                            <div className="hidden md:block overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Product</TableHead>
                                            <TableHead>Price</TableHead>
                                            <TableHead>Stock</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Created</TableHead>
                                            <TableHead className="w-[50px]">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredProducts.map((product: any) => {
                                            const stock = parseInt(product.stock) || 0
                                            const status = getStockStatus(stock)
                                            const primaryImage = product.images?.find((img: any) => img.is_primary)?.image_url

                                            return (
                                                <TableRow key={product.id} className="hover:bg-muted/30">
                                                    <TableCell>
                                                        <div className="flex items-center gap-3 min-w-[200px]">
                                                            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                                                                {primaryImage ? (
                                                                    <img src={primaryImage} alt={product.name} className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <Package className="h-6 w-6 text-muted-foreground" />
                                                                )}
                                                            </div>
                                                            <div className="min-w-0 flex-1">
                                                                <p className="font-medium truncate min-w-[400px] w-full max-w-[400px]" title={product.name}>{product.name}</p>
                                                                <p className="text-xs text-muted-foreground truncate">ID: {product.id.substring(0, 8)}</p>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex flex-col whitespace-nowrap">
                                                            <span className="font-semibold">{product.currency} {product.final_price || product.price}</span>
                                                            {product.discount_percentage && (
                                                                <span className="text-xs text-muted-foreground line-through">{product.currency} {product.price}</span>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className={`font-medium ${getStockColor(stock)}`}>
                                                            {stock}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant={getStatusVariant(status)}>
                                                            {status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                                                        {new Date(product.created_at).toLocaleDateString()}
                                                    </TableCell>
                                                    <TableCell>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon" disabled={deleting}>
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem onClick={() => navigate({ to: "/d/products/$productId", params: { productId: product.id } })}>
                                                                    <Eye className="mr-2 h-4 w-4" />
                                                                    View Details
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => handleEditProduct(product.id)}>
                                                                    <Edit className="mr-2 h-4 w-4" />
                                                                    Edit Product
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    className="text-destructive"
                                                                    onClick={() => handleDeleteProduct(product.id, product.name)}
                                                                >
                                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                                    Delete
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Mobile Card View */}
                            <div className="md:hidden space-y-4 p-4">
                                {filteredProducts.map((product: any) => {
                                    const stock = parseInt(product.stock) || 0
                                    const status = getStockStatus(stock)
                                    const primaryImage = product.images?.find((img: any) => img.is_primary)?.image_url

                                    return (
                                        <Card key={product.id} className="overflow-hidden">
                                            <CardContent className="p-4">
                                                <div className="flex gap-3">
                                                    <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                                                        {primaryImage ? (
                                                            <img src={primaryImage} alt={product.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <Package className="h-8 w-8 text-muted-foreground" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0 space-y-2">
                                                        <div>
                                                            <h3 className="font-semibold text-sm truncate" title={product.name}>{product.name}</h3>
                                                            <p className="text-xs text-muted-foreground truncate">ID: {product.id.substring(0, 12)}</p>
                                                        </div>

                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <Badge variant={getStatusVariant(status)} className="text-xs">
                                                                {status}
                                                            </Badge>
                                                            <span className={`text-sm font-medium ${getStockColor(stock)}`}>
                                                                Stock: {stock}
                                                            </span>
                                                        </div>

                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <span className="font-bold text-primary">{product.currency} {product.final_price || product.price}</span>
                                                                {product.discount_percentage && (
                                                                    <span className="text-xs text-muted-foreground line-through ml-2">{product.currency} {product.price}</span>
                                                                )}
                                                            </div>
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button variant="ghost" size="icon" className="h-8 w-8" disabled={deleting}>
                                                                        <MoreHorizontal className="h-4 w-4" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end">
                                                                    <DropdownMenuItem onClick={() => handleViewProduct(product.id)}>
                                                                        <Eye className="mr-2 h-4 w-4" />
                                                                        View
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem onClick={() => handleEditProduct(product.id)}>
                                                                        <Edit className="mr-2 h-4 w-4" />
                                                                        Edit
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem
                                                                        className="text-destructive"
                                                                        onClick={() => handleDeleteProduct(product.id, product.name)}
                                                                    >
                                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                                        Delete
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </div>

                                                        <p className="text-xs text-muted-foreground">
                                                            {new Date(product.created_at).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )
                                })}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="mt-6 pt-6 border-t px-4 md:px-0">
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={handlePageChange}
                                        totalItems={total}
                                        itemsPerPage={ITEMS_PER_PAGE}
                                    />
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Modals */}
            {viewingProduct && (
                <ProductViewDetails
                    productId={viewingProduct}
                    onClose={handleCloseModals}
                    onEdit={() => handleEditProduct(viewingProduct)}
                />
            )}

            {editingProduct && (
                <ProductEditForm
                    productId={editingProduct}
                    onClose={handleCloseModals}
                    onSave={handleSaveProduct}
                />
            )}

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={handleCloseDeleteModal}
                onConfirm={handleConfirmDelete}
                title="Delete Product"
                description="Are you sure you want to delete this product? This action cannot be undone."
                itemName={deleteModal.productName || undefined}
                isLoading={deleting}
            />
        </div>
    )
}
