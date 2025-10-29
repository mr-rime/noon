import { Separator } from "../ui/separator"
import {
    Package,
    Eye,
    Edit,
    Loader2,
    AlertCircle,
    Calendar,
    Tag,
    Layers,
    Info,
    DollarSign,
    Truck,
    Star,
} from "lucide-react"
import { CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { useQuery } from "@apollo/client"
import { GET_DASHBOARD_PRODUCT } from "@/graphql/product"

interface ProductDetailsProps {
    productId: string
    onClose: () => void
    onEdit: () => void
}

export function ProductViewDetails({ productId, onClose, onEdit }: ProductDetailsProps) {
    const { data, loading, error } = useQuery(GET_DASHBOARD_PRODUCT, {
        variables: { id: productId }
    })

    const product = data?.getDashboardProduct?.product

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
                            <Badge variant="outline" className="ml-2 text-xs font-mono">
                                ID: {product?.id?.substring(0, 8)}
                            </Badge>
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


                        <div className="space-y-4">
                            <div>
                                <h1 className="text-xl md:text-2xl font-bold break-words">{product.name}</h1>
                                <p className="text-sm text-muted-foreground">ID: {product.id}</p>
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                <Badge
                                    variant={stock > 20 ? "default" : stock > 0 ? "secondary" : "destructive"}
                                    className="flex items-center gap-1 px-3 py-1"
                                >
                                    <Package className="h-3 w-3" />
                                    {stock > 20 ? "In Stock" : stock > 0 ? "Low Stock" : "Out of Stock"}
                                    <span className="ml-1 font-mono">({stock})</span>
                                </Badge>
                                {product.is_returnable && (
                                    <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
                                        <Truck className="h-3 w-3" />
                                        Returnable
                                    </Badge>
                                )}
                                <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
                                    <Calendar className="h-3 w-3" />
                                    {new Date(product.created_at).toLocaleDateString()}
                                </Badge>
                            </div>

                            <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-4 border border-primary/20">
                                <div className="flex items-center gap-3">
                                    <DollarSign className="h-6 w-6 text-primary" />
                                    <div className="flex-1">
                                        <div className="flex items-baseline gap-3 flex-wrap">
                                            <span className="text-3xl md:text-4xl font-bold text-primary">
                                                {product.currency} {product.final_price || product.price}
                                            </span>
                                            {product.discount_percentage && (
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="destructive" className="animate-pulse">
                                                        {product.discount_percentage}% OFF
                                                    </Badge>
                                                    <span className="text-lg text-muted-foreground line-through">
                                                        {product.currency} {product.price}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Price includes all applicable taxes
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {product.category_id && (
                                    <div className="bg-muted/30 rounded-lg p-3">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Tag className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm font-medium text-muted-foreground">Category</span>
                                        </div>
                                        <Badge variant="outline" className="font-medium">
                                            {product.category_id}
                                        </Badge>
                                    </div>
                                )}
                                <div className="bg-muted/30 rounded-lg p-3">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Package className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm font-medium text-muted-foreground">Stock Level</span>
                                    </div>
                                    <span className={`font-bold text-lg ${stock > 20 ? 'text-green-600' :
                                        stock > 0 ? 'text-yellow-600' : 'text-red-600'
                                        }`}>
                                        {stock} units
                                    </span>
                                </div>
                            </div>

                            <Separator />

                            {product.productOptions && product.productOptions.length > 0 && (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Layers className="h-5 w-5 text-primary" />
                                        <h3 className="text-lg font-semibold">Available Options</h3>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {product.productOptions.map((opt: any) => (
                                            <div key={opt.id} className="bg-muted/20 rounded-lg p-3">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-medium text-muted-foreground">
                                                        {opt.name}
                                                    </span>
                                                    <Badge variant="secondary" className="text-xs">
                                                        {opt.value}
                                                    </Badge>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {product.productSpecifications && product.productSpecifications.length > 0 && (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Star className="h-5 w-5 text-primary" />
                                        <h3 className="text-lg font-semibold">Specifications</h3>
                                    </div>
                                    <div className="bg-muted/20 rounded-lg p-4">
                                        <div className="grid gap-3">
                                            {product.productSpecifications.map((spec: any) => (
                                                <div key={spec.id} className="flex items-center justify-between py-2 border-b border-muted/40 last:border-0">
                                                    <span className="text-sm font-medium text-muted-foreground">
                                                        {spec.spec_name}
                                                    </span>
                                                    <span className="text-sm font-semibold text-foreground">
                                                        {spec.spec_value}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {product.product_overview && (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Info className="h-5 w-5 text-primary" />
                                        <h3 className="text-lg font-semibold">Product Overview</h3>
                                    </div>
                                    <div className="bg-muted/20 rounded-lg p-4">
                                        <p className="text-sm leading-relaxed text-foreground">
                                            {product.product_overview}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {product.discount && (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <DollarSign className="h-5 w-5 text-primary" />
                                        <h3 className="text-lg font-semibold">Active Promotion</h3>
                                    </div>
                                    <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-lg p-4">
                                        <div className="grid gap-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="font-medium">Discount Type:</span>
                                                <Badge variant="destructive" className="capitalize">
                                                    {product.discount.type}
                                                </Badge>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="font-medium">Discount Value:</span>
                                                <span className="font-bold text-red-600">
                                                    {product.discount.value}{product.discount.type === 'percentage' ? '%' : ` ${product.currency}`}
                                                </span>
                                            </div>
                                            {product.discount.starts_at && (
                                                <div className="flex justify-between">
                                                    <span className="font-medium">Valid From:</span>
                                                    <span className="font-medium">
                                                        {new Date(product.discount.starts_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            )}
                                            {product.discount.ends_at && (
                                                <div className="flex justify-between">
                                                    <span className="font-medium">Valid Until:</span>
                                                    <span className="font-medium">
                                                        {new Date(product.discount.ends_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
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