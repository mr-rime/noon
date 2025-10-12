import { useState, useEffect, useRef } from "react"
import { useMutation, useQuery } from "@apollo/client"
import { Calendar, Package, Percent, DollarSign, Clock, Save, X, Search, Check } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { Badge } from "../ui/badge"
import { CREATE_DISCOUNT, UPDATE_DISCOUNT, GET_PRODUCTS_FOR_DISCOUNT } from "@/graphql/discount"

interface DiscountFormProps {
    isOpen: boolean
    onClose: () => void
    discount?: any
    onSuccess: () => void
}

export function DiscountForm({ isOpen, onClose, discount, onSuccess }: DiscountFormProps) {
    const [formData, setFormData] = useState({
        product_id: "",
        type: "percentage",
        value: "",
        starts_at: "",
        ends_at: ""
    })
    const [selectedProduct, setSelectedProduct] = useState<any>(null)
    const [productSearch, setProductSearch] = useState("")
    const [showProductList, setShowProductList] = useState(false)
    const productListRef = useRef<HTMLDivElement>(null)

    const { data: productsData, loading: productsLoading } = useQuery(GET_PRODUCTS_FOR_DISCOUNT, {
        variables: { limit: 100, offset: 0, search: "" }
    })

    const [createDiscount, { loading: createLoading }] = useMutation(CREATE_DISCOUNT)
    const [updateDiscount, { loading: updateLoading }] = useMutation(UPDATE_DISCOUNT)

    const isLoading = createLoading || updateLoading

    useEffect(() => {
        if (discount) {
            setFormData({
                product_id: discount.product_id || "",
                type: discount.type || "percentage",
                value: discount.value?.toString() || "",
                starts_at: discount.starts_at ? new Date(discount.starts_at).toISOString().slice(0, 16) : "",
                ends_at: discount.ends_at ? new Date(discount.ends_at).toISOString().slice(0, 16) : ""
            })

            // Find the selected product
            const products = productsData?.getProducts?.products || []
            const product = products.find((p: any) => p.id === discount.product_id)
            setSelectedProduct(product)
            setProductSearch(product?.name || "")
        } else {
            setFormData({
                product_id: "",
                type: "percentage",
                value: "",
                starts_at: "",
                ends_at: ""
            })
            setSelectedProduct(null)
            setProductSearch("")
        }
        setShowProductList(false)
    }, [discount, productsData])

    // Close product list when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (productListRef.current && !productListRef.current.contains(event.target as Node)) {
                setShowProductList(false)
            }
        }

        if (showProductList) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [showProductList])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const input = {
                product_id: formData.product_id,
                type: formData.type,
                value: parseFloat(formData.value),
                starts_at: new Date(formData.starts_at).toISOString(),
                ends_at: new Date(formData.ends_at).toISOString()
            }

            if (discount) {
                await updateDiscount({
                    variables: {
                        id: discount.id,
                        input
                    }
                })
            } else {
                await createDiscount({
                    variables: { input }
                })
            }

            onSuccess()
            onClose()
        } catch (error) {
            console.error("Error saving discount:", error)
        }
    }

    const handleProductSelect = (productId: string) => {
        const products = productsData?.getProducts?.products || []
        const product = products.find((p: any) => p.id === productId)
        setSelectedProduct(product)
        setProductSearch(product?.name || "")
        setFormData(prev => ({ ...prev, product_id: productId }))
        setShowProductList(false)
    }

    const filteredProducts = productsData?.getProducts?.products?.filter((product: any) => {
        if (!productSearch) return true
        return product.name.toLowerCase().includes(productSearch.toLowerCase()) ||
            product.psku.toLowerCase().includes(productSearch.toLowerCase())
    }) || []

    const calculateDiscountAmount = () => {
        if (!selectedProduct || !formData.value) return null

        const value = parseFloat(formData.value)
        if (formData.type === "percentage") {
            return (selectedProduct.price * value) / 100
        } else {
            return value
        }
    }

    const calculateFinalPrice = () => {
        if (!selectedProduct || !formData.value) return selectedProduct?.price

        const value = parseFloat(formData.value)
        if (formData.type === "percentage") {
            return selectedProduct.price - (selectedProduct.price * value) / 100
        } else {
            return Math.max(selectedProduct.price - value, 0)
        }
    }

    const isProductAlreadyHasDiscount = (productId: string) => {
        const products = productsData?.getProducts?.products || []
        const product = products.find((p: any) => p.id === productId)
        return product?.discount && product.discount.id !== discount?.id
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 break-words">
                        {discount ? (
                            <>
                                <Percent className="h-5 w-5 flex-shrink-0" />
                                <span className="min-w-0">Edit Discount</span>
                            </>
                        ) : (
                            <>
                                <Percent className="h-5 w-5 flex-shrink-0" />
                                <span className="min-w-0">Create New Discount</span>
                            </>
                        )}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Product Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="product_search" className="flex items-center gap-2">
                            <Package className="h-4 w-4" />
                            Product
                        </Label>
                        <div className="relative" ref={productListRef}>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input
                                    id="product_search"
                                    placeholder="Search for a product..."
                                    value={productSearch}
                                    onChange={(e) => {
                                        setProductSearch(e.target.value)
                                        setShowProductList(true)
                                        if (!e.target.value) {
                                            setSelectedProduct(null)
                                            setFormData(prev => ({ ...prev, product_id: "" }))
                                        }
                                    }}
                                    onFocus={() => setShowProductList(true)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Escape') {
                                            setShowProductList(false)
                                        }
                                    }}
                                    disabled={isLoading}
                                    className="pl-10"
                                />
                                {selectedProduct && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                                        onClick={() => {
                                            setSelectedProduct(null)
                                            setProductSearch("")
                                            setFormData(prev => ({ ...prev, product_id: "" }))
                                        }}
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                )}
                            </div>

                            {/* Product List */}
                            {showProductList && (
                                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                    {productsLoading ? (
                                        <div className="p-3 text-sm text-muted-foreground">Loading products...</div>
                                    ) : filteredProducts.length === 0 ? (
                                        <div className="p-3 text-sm text-muted-foreground">No products found</div>
                                    ) : (
                                        filteredProducts.slice(0, 50).map((product: any) => (
                                            <button
                                                key={product.id}
                                                type="button"
                                                disabled={isProductAlreadyHasDiscount(product.id)}
                                                onClick={() => handleProductSelect(product.id)}
                                                className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed border-b border-gray-100 last:border-b-0 ${selectedProduct?.id === product.id ? 'bg-blue-50' : ''
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="font-medium truncate" title={product.name}>
                                                            {product.name}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground truncate">
                                                            SKU: {product.psku} • {product.currency} {product.price}
                                                        </div>
                                                    </div>
                                                    {isProductAlreadyHasDiscount(product.id) && (
                                                        <Badge variant="secondary" className="text-xs flex-shrink-0 ml-2">
                                                            Has Discount
                                                        </Badge>
                                                    )}
                                                    {selectedProduct?.id === product.id && (
                                                        <Check className="h-4 w-4 text-blue-600 flex-shrink-0 ml-2" />
                                                    )}
                                                </div>
                                            </button>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Product Info */}
                    {selectedProduct && (
                        <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                            <h4 className="font-medium break-words">{selectedProduct.name}</h4>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex-shrink-0">SKU: {selectedProduct.psku}</span>
                                <span className="flex-shrink-0">Price: {selectedProduct.currency} {selectedProduct.price}</span>
                            </div>
                        </div>
                    )}

                    {/* Discount Type */}
                    <div className="space-y-2">
                        <Label htmlFor="type">Discount Type</Label>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, type: "percentage" }))}
                                disabled={isLoading}
                                className={`p-3 border rounded-lg text-left transition-colors ${formData.type === "percentage"
                                        ? "border-blue-500 bg-blue-50 text-blue-700"
                                        : "border-gray-200 hover:bg-gray-50"
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <Percent className="h-4 w-4" />
                                    <span className="font-medium">Percentage</span>
                                </div>
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, type: "fixed" }))}
                                disabled={isLoading}
                                className={`p-3 border rounded-lg text-left transition-colors ${formData.type === "fixed"
                                        ? "border-blue-500 bg-blue-50 text-blue-700"
                                        : "border-gray-200 hover:bg-gray-50"
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <DollarSign className="h-4 w-4" />
                                    <span className="font-medium">Fixed Amount</span>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Discount Value */}
                    <div className="space-y-2">
                        <Label htmlFor="value">
                            Discount Value
                            {formData.type === "percentage" ? " (%)" : ` (${selectedProduct?.currency || 'USD'})`}
                        </Label>
                        <Input
                            id="value"
                            type="number"
                            step={formData.type === "percentage" ? "0.01" : "0.01"}
                            min="0"
                            max={formData.type === "percentage" ? "100" : undefined}
                            value={formData.value}
                            onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                            disabled={isLoading}
                            required
                        />
                    </div>

                    {/* Discount Preview */}
                    {selectedProduct && formData.value && (
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-2">
                            <h5 className="font-medium text-blue-900">Discount Preview</h5>
                            <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                    <span>Original Price:</span>
                                    <span>{selectedProduct.currency} {selectedProduct.price}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Discount Amount:</span>
                                    <span className="text-red-600">
                                        -{selectedProduct.currency} {calculateDiscountAmount()?.toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between font-medium">
                                    <span>Final Price:</span>
                                    <span className="text-green-600">
                                        {selectedProduct.currency} {calculateFinalPrice()?.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Date Range */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="starts_at" className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                Start Date & Time
                            </Label>
                            <Input
                                id="starts_at"
                                type="datetime-local"
                                value={formData.starts_at}
                                onChange={(e) => setFormData(prev => ({ ...prev, starts_at: e.target.value }))}
                                disabled={isLoading}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="ends_at" className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                End Date & Time
                            </Label>
                            <Input
                                id="ends_at"
                                type="datetime-local"
                                value={formData.ends_at}
                                onChange={(e) => setFormData(prev => ({ ...prev, ends_at: e.target.value }))}
                                disabled={isLoading}
                                required
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading || !formData.product_id || !formData.value || !formData.starts_at || !formData.ends_at}
                        >
                            <Save className="h-4 w-4 mr-2" />
                            {isLoading ? "Saving..." : discount ? "Update Discount" : "Create Discount"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
