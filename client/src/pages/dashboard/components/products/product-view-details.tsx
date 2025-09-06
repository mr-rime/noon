import { Separator } from "@/components/ui/separator"
import {
    Package,
    DollarSign,
    Tag,
    Eye,
    Edit,
    Star
} from "lucide-react"
import { CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"

interface ProductDetailsProps {
    productId: number
    onClose: () => void
    onEdit: () => void
}

export function ProductViewDetails({ productId, onClose, onEdit }: ProductDetailsProps) {
    // Mock product data - in real app, fetch by productId
    const product = {
        id: productId,
        name: "Wireless Bluetooth Headphones",
        sku: "WH-001",
        price: 99.99,
        stock: 45,
        category: "Electronics",
        subcategory: "Audio",
        status: "Active",
        description: "High-quality wireless bluetooth headphones with noise cancellation and 30-hour battery life.",
        images: ["/api/placeholder/400/300"],
        rating: 4.5,
        reviews: 123,
        weight: "250g",
        dimensions: "20cm x 15cm x 8cm",
        tags: ["wireless", "bluetooth", "noise-cancelling"],
        createdAt: "2024-01-15",
        updatedAt: "2024-02-10"
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-background rounded-lg shadow-elevated max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <CardHeader className="border-b">
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <Eye className="h-5 w-5 text-primary" />
                            Product Details
                        </CardTitle>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={onEdit}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Product
                            </Button>
                            <Button variant="ghost" onClick={onClose}>×</Button>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Product Image */}
                        <div>
                            <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center mb-4">
                                <Package className="h-16 w-16 text-muted-foreground" />
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <div key={i} className="w-full h-16 bg-muted rounded-lg flex items-center justify-center">
                                        <Package className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="space-y-4">
                            <div>
                                <h1 className="text-2xl font-bold">{product.name}</h1>
                                <p className="text-muted-foreground">SKU: {product.sku}</p>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    <span className="font-medium">{product.rating}</span>
                                    <span className="text-muted-foreground">({product.reviews} reviews)</span>
                                </div>
                                <Badge variant={product.status === "Active" ? "default" : "secondary"}>
                                    {product.status}
                                </Badge>
                            </div>

                            <div className="flex items-center gap-2">
                                <DollarSign className="h-5 w-5 text-success" />
                                <span className="text-2xl font-bold text-success">${product.price}</span>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Category</p>
                                    <Badge variant="outline">{product.category}</Badge>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Subcategory</p>
                                    <Badge variant="outline">{product.subcategory}</Badge>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Stock</p>
                                    <span className="font-medium">{product.stock} units</span>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Weight</p>
                                    <span className="font-medium">{product.weight}</span>
                                </div>
                            </div>

                            <Separator />

                            <div>
                                <p className="text-sm text-muted-foreground mb-2">Tags</p>
                                <div className="flex flex-wrap gap-2">
                                    {product.tags.map((tag) => (
                                        <Badge key={tag} variant="secondary">
                                            <Tag className="h-3 w-3 mr-1" />
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground mb-2">Description</p>
                                <p className="text-sm">{product.description}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-muted-foreground">Created</p>
                                    <p>{product.createdAt}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Last Updated</p>
                                    <p>{product.updatedAt}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </div>
        </div>
    )
}