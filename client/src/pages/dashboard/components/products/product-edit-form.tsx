import { useState, useEffect } from "react"

import {
    Edit,
    Save,
    X,
    Loader2,
    AlertCircle
} from "lucide-react"
import { CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { useMutation, useQuery } from "@apollo/client"
import { GET_PRODUCT, UPDATE_PRODUCT } from "@/graphql/product"
import { toast } from "sonner"

interface ProductEditFormProps {
    productId: string
    onClose: () => void
    onSave: () => void
}

export function ProductEditForm({ productId, onClose, onSave }: ProductEditFormProps) {
    const { data, loading: loadingProduct, error } = useQuery(GET_PRODUCT, {
        variables: { id: productId }
    })

    const product = data?.getProduct?.product

    const [formData, setFormData] = useState({
        name: "",
        price: "",
        category_id: "",
        currency: "USD",
        is_returnable: false,
        product_overview: ""
    })

    // Update form data when product loads
    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || "",
                price: product.price?.toString() || "",
                category_id: product.category_id || "",
                currency: product.currency || "USD",
                is_returnable: product.is_returnable || false,
                product_overview: product.product_overview || ""
            })
        }
    }, [product])

    const [updateProduct, { loading: updating }] = useMutation(UPDATE_PRODUCT, {
        onCompleted: (data) => {
            if (data.updateProduct.success) {
                toast.success('Product updated successfully')
                onSave()
            } else {
                toast.error(data.updateProduct.message || 'Failed to update product')
            }
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to update product')
        }
    })

    const handleSave = async () => {
        try {
            await updateProduct({
                variables: {
                    id: productId,
                    name: formData.name,
                    price: parseFloat(formData.price),
                    category_id: formData.category_id || null,
                    currency: formData.currency,
                    is_returnable: formData.is_returnable,
                    product_overview: formData.product_overview
                }
            })
        } catch (error) {
            console.error('Error updating product:', error)
        }
    }

    if (loadingProduct) {
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

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-background rounded-lg shadow-elevated max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <CardHeader className="border-b">
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <Edit className="h-5 w-5 text-primary" />
                            Edit Product
                        </CardTitle>
                        <Button variant="ghost" onClick={onClose}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>

                <CardContent className="p-6">
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="name">Product Name</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="Enter product name"
                                />
                            </div>
                            <div>
                                <Label htmlFor="currency">Currency</Label>
                                <Select value={formData.currency} onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="USD">USD</SelectItem>
                                        <SelectItem value="EUR">EUR</SelectItem>
                                        <SelectItem value="GBP">GBP</SelectItem>
                                        <SelectItem value="AED">AED</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="price">Price</Label>
                            <Input
                                id="price"
                                type="number"
                                step="0.01"
                                value={formData.price}
                                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                                placeholder="0.00"
                            />
                        </div>

                        <div>
                            <Label htmlFor="category_id">Category ID</Label>
                            <Input
                                id="category_id"
                                value={formData.category_id}
                                onChange={(e) => setFormData(prev => ({ ...prev, category_id: e.target.value }))}
                                placeholder="Enter category ID (optional)"
                            />
                        </div>

                        <div>
                            <Label htmlFor="product_overview">Product Overview</Label>
                            <Textarea
                                id="product_overview"
                                value={formData.product_overview}
                                onChange={(e) => setFormData(prev => ({ ...prev, product_overview: e.target.value }))}
                                rows={4}
                                placeholder="Enter product description..."
                            />
                        </div>

                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="is_returnable"
                                checked={formData.is_returnable}
                                onChange={(e) => setFormData(prev => ({ ...prev, is_returnable: e.target.checked }))}
                                className="rounded border-gray-300"
                            />
                            <Label htmlFor="is_returnable">Product is returnable</Label>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <Button 
                                onClick={handleSave} 
                                className="flex-1" 
                                disabled={updating}
                            >
                                <Save className="h-4 w-4 mr-2" />
                                {updating ? 'Updating...' : 'Update Product'}
                            </Button>
                            <Button variant="outline" onClick={onClose}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </div>
        </div>
    )
}