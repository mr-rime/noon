import { useState } from "react"

import {
    Search,
    Plus,
    MoreHorizontal,
    Edit,
    Eye,
    Trash2,
    Package
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

const products = [
    {
        id: 1,
        image: "/api/placeholder/60/60",
        name: "Wireless Bluetooth Headphones",
        sku: "WH-001",
        price: 99.99,
        stock: 45,
        category: "Electronics",
        status: "Active"
    },
    {
        id: 2,
        image: "/api/placeholder/60/60",
        name: "Smart Fitness Watch",
        sku: "SW-002",
        price: 249.99,
        stock: 12,
        category: "Wearables",
        status: "Active"
    },
    {
        id: 3,
        image: "/api/placeholder/60/60",
        name: "Ergonomic Laptop Stand",
        sku: "LS-003",
        price: 39.99,
        stock: 0,
        category: "Accessories",
        status: "Out of Stock"
    },
    {
        id: 4,
        image: "/api/placeholder/60/60",
        name: "USB-C Fast Charging Cable",
        sku: "UC-004",
        price: 19.99,
        stock: 156,
        category: "Cables",
        status: "Active"
    },
    {
        id: 5,
        image: "/api/placeholder/60/60",
        name: "Wireless Mouse Pad",
        sku: "MP-005",
        price: 29.99,
        stock: 33,
        category: "Accessories",
        status: "Active"
    }
]

export default function Products() {
    const navigate = useNavigate()
    const [searchTerm, setSearchTerm] = useState("")
    const [viewingProduct, setViewingProduct] = useState<number | null>(null)
    const [editingProduct, setEditingProduct] = useState<number | null>(null)
    const [filters, setFilters] = useState({
        status: [] as string[],
        category: [] as string[],
        stockLevel: [] as string[]
    })

    const filteredProducts = products.filter(product => {
        // Search filter
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.sku.toLowerCase().includes(searchTerm.toLowerCase())

        // Status filter
        const matchesStatus = filters.status.length === 0 || filters.status.includes(product.status)

        // Category filter
        const matchesCategory = filters.category.length === 0 || filters.category.includes(product.category)

        // Stock level filter
        let matchesStockLevel = true
        if (filters.stockLevel.length > 0) {
            matchesStockLevel = filters.stockLevel.some(level => {
                switch (level) {
                    case "in-stock":
                        return product.stock > 20
                    case "low-stock":
                        return product.stock > 0 && product.stock <= 20
                    case "out-of-stock":
                        return product.stock === 0
                    default:
                        return true
                }
            })
        }

        return matchesSearch && matchesStatus && matchesCategory && matchesStockLevel
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

    const handleViewProduct = (productId: number) => {
        setViewingProduct(productId)
    }

    const handleEditProduct = (productId: number) => {
        setEditingProduct(productId)
        setViewingProduct(null)
    }

    const handleCloseModals = () => {
        setViewingProduct(null)
        setEditingProduct(null)
    }

    const handleSaveProduct = () => {
        // Handle save logic
        setEditingProduct(null)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Products Management</h1>
                    <p className="text-muted-foreground">Manage your product catalog and inventory</p>
                </div>
                <Button variant="admin" className="gap-2" onClick={() => navigate({ to: "/d/products/new" })}>
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
                    <CardTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-primary" />
                        All Products ({filteredProducts.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Product</TableHead>
                                <TableHead>SKU</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Stock</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="w-[50px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredProducts.map((product) => (
                                <TableRow key={product.id} className="hover:bg-muted/30">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                                                <Package className="h-6 w-6 text-muted-foreground" />
                                            </div>
                                            <div>
                                                <p className="font-medium">{product.name}</p>
                                                <p className="text-sm text-muted-foreground">ID: {product.id}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                                    <TableCell className="font-semibold">${product.price}</TableCell>
                                    <TableCell>
                                        <span className={`font-medium ${getStockColor(product.stock)}`}>
                                            {product.stock}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{product.category}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusVariant(product.status)}>
                                            {product.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleViewProduct(product.id)}>
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleEditProduct(product.id)}>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit Product
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive">
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
        </div>
    )
}
