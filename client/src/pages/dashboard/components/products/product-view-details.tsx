import { Separator } from "@/components/ui/separator"
import {
    Package,
    Eye,
    Edit,
    Loader2,
    AlertCircle
} from "lucide-react"
import { CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { useQuery } from "@apollo/client"
import { GET_PRODUCT } from "@/graphql/product"

interface ProductDetailsProps {
    productId: string
    onClose: () => void
    onEdit: () => void
}

export function ProductViewDetails({ productId, onClose, onEdit }: ProductDetailsProps) {
    const { data, loading, error } = useQuery(GET_PRODUCT, {
        variables: { id: productId }
    })

    const product = data?.getProduct?.product

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                <div className="bg-background rounded-lg shadow-elevated p-12">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
                    <p className="mt-4 text-muted-foreground">Loading product...</p>
                </div>
            </div>
        )
    }

    if (error || !product) {
        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                <div className="bg-background rounded-lg shadow-elevated p-12 text-center">
                    <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">Failed to load product</p>
                    <Button onClick={onClose}>Close</Button>
                </div>
            </div>
        )
    }

    const stock = parseInt(product.stock) || 0
    const primaryImage = product.images?.find((img: any) => img.is_primary)?.image_url
    const otherImages = product.images?.filter((img: any) => !img.is_primary) || []

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

                <CardContent className="p-4 md:p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Product Image */}
                        <div>
                            <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center mb-4 overflow-hidden">
                                {primaryImage ? (
                                    <img src={primaryImage} alt={product.name} className="w-full h-full object-cover" />
                                ) : (
                                    <Package className="h-16 w-16 text-muted-foreground" />
                                )}
                            </div>
                            {otherImages.length > 0 && (
                                <div className="grid grid-cols-4 gap-2">
                                    {otherImages.slice(0, 4).map((img: any, i: number) => (
                                        <div key={i} className="w-full h-16 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                                            <img src={img.image_url} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div className="space-y-4">
                            <div>
                                <h1 className="text-xl md:text-2xl font-bold break-words">{product.name}</h1>
                                <p className="text-sm text-muted-foreground">ID: {product.id.substring(0, 12)}...</p>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                                <Badge variant={stock > 0 ? "default" : "destructive"}>
                                    {stock > 20 ? "In Stock" : stock > 0 ? "Low Stock" : "Out of Stock"}
                                </Badge>
                                {product.is_returnable && (
                                    <Badge variant="outline">Returnable</Badge>
                                )}
                            </div>

                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl md:text-3xl font-bold text-primary">
                                        {product.currency} {product.final_price}
                                    </span>
                                    {product.discount_percentage && (
                                        <Badge variant="destructive">{product.discount_percentage}% OFF</Badge>
                                    )}
                                </div>
                                {product.discount_percentage && (
                                    <span className="text-sm text-muted-foreground line-through">
                                        {product.currency} {product.price}
                                    </span>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {product.category_id && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">Category</p>
                                        <Badge variant="outline">{product.category_id}</Badge>
                                    </div>
                                )}
                                <div>
                                    <p className="text-sm text-muted-foreground">Stock</p>
                                    <span className="font-medium">{stock} units</span>
                                </div>
                            </div>

                            <Separator />

                            {product.productOptions && product.productOptions.length > 0 && (
                                <div>
                                    <p className="text-sm text-muted-foreground mb-2">Options</p>
                                    <div className="flex flex-wrap gap-2">
                                        {product.productOptions.map((opt: any) => (
                                            <Badge key={opt.id} variant="secondary" className="text-xs">
                                                {opt.name}: {opt.value}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {product.productSpecifications && product.productSpecifications.length > 0 && (
                                <div>
                                    <p className="text-sm text-muted-foreground mb-2">Specifications</p>
                                    <div className="space-y-1">
                                        {product.productSpecifications.map((spec: any) => (
                                            <div key={spec.id} className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">{spec.spec_name}:</span>
                                                <span className="font-medium">{spec.spec_value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {product.product_overview && (
                                <div>
                                    <p className="text-sm text-muted-foreground mb-2">Overview</p>
                                    <p className="text-sm break-words">{product.product_overview}</p>
                                </div>
                            )}

                            {product.discount && (
                                <div>
                                    <p className="text-sm text-muted-foreground mb-2">Active Discount</p>
                                    <div className="text-sm space-y-1">
                                        <p>Type: <span className="font-medium capitalize">{product.discount.type}</span></p>
                                        <p>Value: <span className="font-medium">{product.discount.value}{product.discount.type === 'percentage' ? '%' : ` ${product.currency}`}</span></p>
                                        {product.discount.starts_at && (
                                            <p>Starts: <span className="font-medium">{new Date(product.discount.starts_at).toLocaleDateString()}</span></p>
                                        )}
                                        {product.discount.ends_at && (
                                            <p>Ends: <span className="font-medium">{new Date(product.discount.ends_at).toLocaleDateString()}</span></p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </div>
        </div>
    )
}