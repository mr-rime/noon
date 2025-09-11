import { useState } from "react"
import { Gift, X, Plus, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { Card, CardContent } from "../ui/card"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Textarea } from "../ui/textarea"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"

interface ProductOffer {
    id: number
    name: string
    type: string
    description: string
    linkedProducts: string[]
    conditions: string
    startDate: string
    endDate: string
    usageCount: number
    status: string
    discountValue?: number
    discountType?: "percentage" | "fixed"
    minimumOrder?: number
}

interface EditProductOfferModalProps {
    isOpen: boolean
    onClose: () => void
    offer: ProductOffer | null
    onSave: (offer: ProductOffer) => void
}

export default function EditProductOfferModal({ isOpen, onClose, offer, onSave }: EditProductOfferModalProps) {
    const [formData, setFormData] = useState({
        name: offer?.name || "",
        type: offer?.type || "",
        description: offer?.description || "",
        conditions: offer?.conditions || "",
        startDate: offer?.startDate || "",
        endDate: offer?.endDate || "",
        discountValue: offer?.discountValue || 0,
        discountType: offer?.discountType || "percentage" as const,
        minimumOrder: offer?.minimumOrder || 0,
        linkedProducts: offer?.linkedProducts || []
    })

    const [newProduct, setNewProduct] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!offer) return

        const updatedOffer = {
            ...offer,
            ...formData
        }

        onSave(updatedOffer)
        // toast({
        //     title: "Offer Updated",
        //     description: "Product offer has been updated successfully.",
        // })
        onClose()
    }

    const handleInputChange = (field: string, value: string | number | string[]) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const addProduct = () => {
        if (newProduct.trim() && !formData.linkedProducts.includes(newProduct.trim())) {
            handleInputChange("linkedProducts", [...formData.linkedProducts, newProduct.trim()])
            setNewProduct("")
        }
    }

    const removeProduct = (productToRemove: string) => {
        handleInputChange("linkedProducts", formData.linkedProducts.filter(p => p !== productToRemove))
    }

    if (!offer) return null

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Gift className="h-5 w-5 text-primary" />
                        Edit Product Offer
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <Card>
                        <CardContent className="pt-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Offer Name *</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange("name", e.target.value)}
                                        placeholder="Enter offer name"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="type">Offer Type *</Label>
                                    <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select offer type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="BOGO">Buy One Get One</SelectItem>
                                            <SelectItem value="Bundle">Bundle Deal</SelectItem>
                                            <SelectItem value="Free Shipping">Free Shipping</SelectItem>
                                            <SelectItem value="Gift with Purchase">Gift with Purchase</SelectItem>
                                            <SelectItem value="Percentage Discount">Percentage Discount</SelectItem>
                                            <SelectItem value="Fixed Discount">Fixed Amount Discount</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description *</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => handleInputChange("description", e.target.value)}
                                    placeholder="Describe the offer details"
                                    required
                                    rows={3}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="conditions">Conditions *</Label>
                                <Input
                                    id="conditions"
                                    value={formData.conditions}
                                    onChange={(e) => handleInputChange("conditions", e.target.value)}
                                    placeholder="e.g., Min 2 items, Min order $50"
                                    required
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Discount Settings */}
                    {(formData.type === "Percentage Discount" || formData.type === "Fixed Discount") && (
                        <Card>
                            <CardContent className="pt-6 space-y-4">
                                <Label className="text-sm font-medium">Discount Settings</Label>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="discountValue">Discount Value *</Label>
                                        <Input
                                            id="discountValue"
                                            type="number"
                                            value={formData.discountValue}
                                            onChange={(e) => handleInputChange("discountValue", Number(e.target.value))}
                                            placeholder="Enter discount value"
                                            min="0"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="discountType">Discount Type</Label>
                                        <Select
                                            value={formData.discountType}
                                            onValueChange={(value: "percentage" | "fixed") => handleInputChange("discountType", value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="percentage">Percentage (%)</SelectItem>
                                                <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="minimumOrder">Minimum Order Amount</Label>
                                    <Input
                                        id="minimumOrder"
                                        type="number"
                                        value={formData.minimumOrder}
                                        onChange={(e) => handleInputChange("minimumOrder", Number(e.target.value))}
                                        placeholder="Enter minimum order amount"
                                        min="0"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Linked Products */}
                    <Card>
                        <CardContent className="pt-6 space-y-4">
                            <Label className="text-sm font-medium">Linked Products</Label>

                            <div className="flex gap-2">
                                <Input
                                    value={newProduct}
                                    onChange={(e) => setNewProduct(e.target.value)}
                                    placeholder="Enter product name"
                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addProduct())}
                                />
                                <Button type="button" onClick={addProduct} variant="outline">
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>

                            <div className="space-y-2">
                                {formData.linkedProducts.map((product, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                        <Badge variant="secondary">{product}</Badge>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeProduct(product)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                                {formData.linkedProducts.length === 0 && (
                                    <p className="text-sm text-muted-foreground">No products linked yet</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Schedule */}
                    <Card>
                        <CardContent className="pt-6 space-y-4">
                            <Label className="text-sm font-medium">Offer Schedule</Label>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="startDate">Start Date *</Label>
                                    <Input
                                        id="startDate"
                                        type="date"
                                        value={formData.startDate}
                                        onChange={(e) => handleInputChange("startDate", e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="endDate">End Date *</Label>
                                    <Input
                                        id="endDate"
                                        type="date"
                                        value={formData.endDate}
                                        onChange={(e) => handleInputChange("endDate", e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Usage Statistics */}
                    <Card>
                        <CardContent className="pt-6">
                            <Label className="text-sm font-medium">Usage Statistics</Label>
                            <div className="grid grid-cols-2 gap-4 mt-4">
                                <div className="text-center p-4 bg-muted/50 rounded-lg">
                                    <div className="text-2xl font-bold text-foreground">{offer.usageCount}</div>
                                    <div className="text-sm text-muted-foreground">Times Used</div>
                                </div>
                                <div className="text-center p-4 bg-muted/50 rounded-lg">
                                    <div className="text-2xl font-bold text-foreground">
                                        <Badge variant={offer.status === "Active" ? "default" : offer.status === "Expired" ? "destructive" : "secondary"}>
                                            {offer.status}
                                        </Badge>
                                    </div>
                                    <div className="text-sm text-muted-foreground">Current Status</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={onClose}>
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                        </Button>
                        <Button type="submit" variant="admin">
                            Save Changes
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}