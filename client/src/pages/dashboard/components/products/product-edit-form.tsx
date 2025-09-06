import { useState } from "react"

import {
    Edit,
    Save,
    X,
    Upload,
    Plus
} from "lucide-react"
import { CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Textarea } from "../ui/textarea"
import { Badge } from "../ui/badge"

interface ProductEditFormProps {
    productId: number
    onClose: () => void
    onSave: () => void
}

export function ProductEditForm({ onClose, onSave }: ProductEditFormProps) {
    const [formData, setFormData] = useState({
        name: "Wireless Bluetooth Headphones",
        sku: "WH-001",
        price: "99.99",
        stock: "45",
        category: "Electronics",
        subcategory: "Audio",
        status: "Active",
        description: "High-quality wireless bluetooth headphones with noise cancellation and 30-hour battery life.",
        weight: "250",
        dimensions: "20cm x 15cm x 8cm",
        tags: ["wireless", "bluetooth", "noise-cancelling"]
    })

    const [newTag, setNewTag] = useState("")

    const addTag = () => {
        if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, newTag.trim()]
            }))
            setNewTag("")
        }
    }

    const removeTag = (tagToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }))
    }

    const handleSave = () => {
        // Handle save logic here
        console.log("Saving product:", formData)
        onSave()
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
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Product Images */}
                        <div>
                            <Label className="text-sm font-medium mb-2 block">Product Images</Label>
                            <div className="w-full h-64 bg-muted rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center mb-4">
                                <div className="text-center">
                                    <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                                    <p className="text-sm text-muted-foreground">Upload main image</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <div key={i} className="w-full h-16 bg-muted rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center">
                                        <Upload className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Product Form */}
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="name">Product Name</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="sku">SKU</Label>
                                    <Input
                                        id="sku"
                                        value={formData.sku}
                                        onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="price">Price ($)</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="stock">Stock</Label>
                                    <Input
                                        id="stock"
                                        type="number"
                                        value={formData.stock}
                                        onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="category">Category</Label>
                                    <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Electronics">Electronics</SelectItem>
                                            <SelectItem value="Clothing">Clothing</SelectItem>
                                            <SelectItem value="Home & Garden">Home & Garden</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="subcategory">Subcategory</Label>
                                    <Select value={formData.subcategory} onValueChange={(value) => setFormData(prev => ({ ...prev, subcategory: value }))}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Audio">Audio</SelectItem>
                                            <SelectItem value="Mobile">Mobile</SelectItem>
                                            <SelectItem value="Computers">Computers</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="status">Status</Label>
                                <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Active">Active</SelectItem>
                                        <SelectItem value="Draft">Draft</SelectItem>
                                        <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    rows={3}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="weight">Weight (g)</Label>
                                    <Input
                                        id="weight"
                                        value={formData.weight}
                                        onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="dimensions">Dimensions</Label>
                                    <Input
                                        id="dimensions"
                                        value={formData.dimensions}
                                        onChange={(e) => setFormData(prev => ({ ...prev, dimensions: e.target.value }))}
                                    />
                                </div>
                            </div>

                            <div>
                                <Label>Tags</Label>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {formData.tags.map((tag) => (
                                        <Badge key={tag} variant="secondary" className="gap-1">
                                            {tag}
                                            <button onClick={() => removeTag(tag)} className="ml-1 hover:text-destructive">
                                                <X className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Add new tag"
                                        value={newTag}
                                        onChange={(e) => setNewTag(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && addTag()}
                                    />
                                    <Button onClick={addTag} size="sm">
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="flex gap-2 pt-4">
                                <Button onClick={handleSave} className="flex-1">
                                    <Save className="h-4 w-4 mr-2" />
                                    Save Changes
                                </Button>
                                <Button variant="outline" onClick={onClose}>
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </div>
        </div>
    )
}