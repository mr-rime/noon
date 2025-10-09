import { useState } from "react"
import { useQuery, useMutation } from "@apollo/client"
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
    Hash,
    Users,
    Plus,
    Save,
    X
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { toast } from "sonner"
import { GET_PRODUCT } from "@/graphql/product"
import { GET_PRODUCT_GROUPS, ADD_PRODUCT_TO_GROUP } from "@/graphql/psku"

interface ProductPskuDetailsProps {
    productId: string
    onClose: () => void
    onEdit: () => void
}

export function ProductPskuDetails({ productId, onClose, onEdit }: ProductPskuDetailsProps) {
    const [editingGroup, setEditingGroup] = useState(false)
    const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null)

    const { data, loading, error, refetch } = useQuery(GET_PRODUCT, {
        variables: { id: productId }
    })

    const { data: groupsData } = useQuery(GET_PRODUCT_GROUPS, {
        variables: { category_id: data?.getProduct?.product?.category_id }
    })

    const [addToGroup, { loading: addingToGroup }] = useMutation(ADD_PRODUCT_TO_GROUP)

    const product = data?.getProduct?.product
    const productGroups = groupsData?.getProductGroups?.groups || []

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

    const handleAddToGroup = async () => {
        if (!selectedGroupId) return

        try {
            const { data: result } = await addToGroup({
                variables: {
                    product_id: productId,
                    group_id: selectedGroupId
                }
            })

            if (result?.addProductToGroup?.success) {
                toast.success("Product added to group successfully!")
                refetch()
                setEditingGroup(false)
                setSelectedGroupId(null)
            } else {
                toast.error(result?.addProductToGroup?.message || "Failed to add product to group")
            }
        } catch (error) {
            console.error("Error adding product to group:", error)
            toast.error("An error occurred while adding product to group")
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-background rounded-lg shadow-elevated max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                <CardHeader className="border-b flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <Eye className="h-5 w-5 text-primary" />
                            Product Details
                            <Badge variant="outline" className="ml-2 text-xs font-mono">
                                ID: {product?.id?.substring(0, 8)}
                            </Badge>
                            {product.psku && (
                                <Badge variant="secondary" className="text-xs font-mono">
                                    PSKU: {product.psku}
                                </Badge>
                            )}
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

                <CardContent className="flex-1 overflow-y-auto p-0">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">

                        {/* Left Column - Product Info */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Product Images */}
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
                                    <h1 className="text-2xl font-bold break-words">{product.name}</h1>
                                    <p className="text-sm text-muted-foreground">ID: {product.id}</p>
                                    {product.psku && (
                                        <p className="text-sm text-muted-foreground">PSKU: {product.psku}</p>
                                    )}
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
                                                <span className="text-3xl font-bold text-primary">
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

                                {/* Category and Brand Info */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {product.category_name && (
                                        <div className="bg-muted/30 rounded-lg p-3">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Tag className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm font-medium text-muted-foreground">Category</span>
                                            </div>
                                            <Badge variant="outline" className="font-medium">
                                                {product.category_name}
                                            </Badge>
                                            {product.subcategory_name && (
                                                <Badge variant="secondary" className="ml-2 font-medium">
                                                    {product.subcategory_name}
                                                </Badge>
                                            )}
                                        </div>
                                    )}

                                    {product.brand_name && (
                                        <div className="bg-muted/30 rounded-lg p-3">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Star className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm font-medium text-muted-foreground">Brand</span>
                                            </div>
                                            <Badge variant="outline" className="font-medium">
                                                {product.brand_name}
                                            </Badge>
                                        </div>
                                    )}
                                </div>

                                {/* Product Overview */}
                                {product.product_overview && (
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">Product Overview</h3>
                                        <p className="text-muted-foreground whitespace-pre-wrap">{product.product_overview}</p>
                                    </div>
                                )}

                                {/* Specifications */}
                                {product.productSpecifications && product.productSpecifications.length > 0 && (
                                    <div className="space-y-3">
                                        <h3 className="text-lg font-semibold flex items-center gap-2">
                                            <Info className="h-5 w-5 text-primary" />
                                            Specifications
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {product.productSpecifications.map((spec: any) => (
                                                <div key={spec.id} className="bg-muted/30 rounded-lg p-3">
                                                    <div className="text-sm font-medium text-muted-foreground">{spec.spec_name}</div>
                                                    <div className="font-medium">{spec.spec_value}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Product Attributes */}
                                {product.productAttributes && product.productAttributes.length > 0 && (
                                    <div className="space-y-3">
                                        <h3 className="text-lg font-semibold flex items-center gap-2">
                                            <Layers className="h-5 w-5 text-primary" />
                                            Product Attributes
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {product.productAttributes.map((attr: any) => (
                                                <div key={attr.id} className="bg-muted/30 rounded-lg p-3">
                                                    <div className="text-sm font-medium text-muted-foreground">{attr.attribute_name}</div>
                                                    <div className="font-medium">{attr.attribute_value}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Column - Product Group Management */}
                        <div className="space-y-6">

                            {/* Product Group Status */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Users className="h-5 w-5" />
                                        Product Group
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {product.group_name ? (
                                        <div className="space-y-3">
                                            <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Badge variant="default">Current Group</Badge>
                                                </div>
                                                <h4 className="font-medium">{product.group_name}</h4>
                                                <p className="text-sm text-muted-foreground">ID: {product.group_id}</p>
                                            </div>

                                            {/* Group Attributes */}
                                            {product.groupAttributes && product.groupAttributes.length > 0 && (
                                                <div>
                                                    <h5 className="font-medium mb-2">Group Attributes</h5>
                                                    <div className="space-y-2">
                                                        {product.groupAttributes.map((attr: any) => (
                                                            <div key={attr.id} className="text-sm">
                                                                <span className="font-medium">{attr.attribute_name}:</span>
                                                                <div className="flex flex-wrap gap-1 mt-1">
                                                                    {attr.attribute_values?.map((value: string, i: number) => (
                                                                        <Badge key={i} variant="outline" className="text-xs">
                                                                            {value}
                                                                        </Badge>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Group Products */}
                                            {product.groupProducts && product.groupProducts.length > 0 && (
                                                <div>
                                                    <h5 className="font-medium mb-2">Products in Group ({product.groupProducts.length})</h5>
                                                    <div className="text-sm text-muted-foreground">
                                                        This product is part of a group with {product.groupProducts.length - 1} other variants.
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-center py-4">
                                            <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                                            <p className="text-sm text-muted-foreground mb-3">Not assigned to any group</p>
                                            <Button
                                                size="sm"
                                                onClick={() => setEditingGroup(true)}
                                                className="w-full"
                                            >
                                                <Plus className="h-4 w-4 mr-2" />
                                                Assign to Group
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Available Groups */}
                            {editingGroup && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Available Groups</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        {productGroups.length > 0 ? (
                                            <>
                                                {productGroups.map((group: any) => (
                                                    <div
                                                        key={group.group_id}
                                                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${selectedGroupId === group.group_id
                                                                ? 'border-primary bg-primary/10'
                                                                : 'hover:border-primary/50'
                                                            }`}
                                                        onClick={() => setSelectedGroupId(group.group_id)}
                                                    >
                                                        <h4 className="font-medium">{group.name}</h4>
                                                        {group.description && (
                                                            <p className="text-sm text-muted-foreground">{group.description}</p>
                                                        )}
                                                        <p className="text-xs text-muted-foreground mt-1">ID: {group.group_id}</p>
                                                    </div>
                                                ))}

                                                <div className="flex gap-2 pt-3">
                                                    <Button
                                                        size="sm"
                                                        onClick={handleAddToGroup}
                                                        disabled={!selectedGroupId || addingToGroup}
                                                        className="flex-1"
                                                    >
                                                        {addingToGroup ? (
                                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                        ) : (
                                                            <Save className="h-4 w-4 mr-2" />
                                                        )}
                                                        Add to Group
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => {
                                                            setEditingGroup(false)
                                                            setSelectedGroupId(null)
                                                        }}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="text-center py-4">
                                                <p className="text-sm text-muted-foreground">No groups available for this category</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            )}

                            {/* Quick Actions */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <Button variant="outline" size="sm" className="w-full justify-start">
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit Product
                                    </Button>
                                    <Button variant="outline" size="sm" className="w-full justify-start">
                                        <Package className="h-4 w-4 mr-2" />
                                        Manage Stock
                                    </Button>
                                    <Button variant="outline" size="sm" className="w-full justify-start">
                                        <DollarSign className="h-4 w-4 mr-2" />
                                        Update Pricing
                                    </Button>
                                    <Button variant="outline" size="sm" className="w-full justify-start">
                                        <Hash className="h-4 w-4 mr-2" />
                                        Generate New PSKU
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </CardContent>
            </div>
        </div>
    )
}
