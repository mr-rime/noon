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
        stock: "",
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
                stock: product.stock || "",
                category_id: product.category_id || "",
                currency: product.currency || "USD",
                is_returnable: product.is_returnable || false,
                product_overview: product.product_overview || ""
            })
        }
    }, [product])

    const [newTag, setNewTag] = useState("")
    const [specName, setSpecName] = useState("")
    const [specValue, setSpecValue] = useState("")
    const [specifications, setSpecifications] = useState<{ spec_name: string; spec_value: string }[]>([])
    const [optionGroupName, setOptionGroupName] = useState("")
    const [optionValue, setOptionValue] = useState("")
    const [optionGroups, setOptionGroups] = useState<{ name: string; values: string[] }[]>([])
    type Variant = { sku: string; options: { name: string; value: string }[]; price?: number; stock?: number; image_url?: string }
    const [variants, setVariants] = useState<Variant[]>([])
    const [createProductWithVariants, { loading: isSaving }] = useMutation(CREATE_PRODUCT_WITH_VARIANTS)
    const [uploadFile] = useMutation(UPLOAD_FILE)

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

    const addSpecification = () => {
        if (!specName.trim() || !specValue.trim()) return
        setSpecifications(prev => [...prev, { spec_name: specName.trim(), spec_value: specValue.trim() }])
        setSpecName("")
        setSpecValue("")
    }

    const removeSpecification = (idx: number) => {
        setSpecifications(prev => prev.filter((_, i) => i !== idx))
    }

    const addOptionGroup = () => {
        if (!optionGroupName.trim() || !optionValue.trim()) return
        setOptionGroups(prev => {
            const existing = prev.find(g => g.name === optionGroupName.trim())
            if (existing) {
                if (!existing.values.includes(optionValue.trim())) {
                    return prev.map(g => g.name === existing.name ? { ...g, values: [...g.values, optionValue.trim()] } : g)
                }
                return prev
            }
            return [...prev, { name: optionGroupName.trim(), values: [optionValue.trim()] }]
        })
        setOptionValue("")
    }

    const removeOptionValue = (groupName: string, value: string) => {
        setOptionGroups(prev => prev.map(g => g.name === groupName ? { ...g, values: g.values.filter(v => v !== value) } : g))
    }

    const removeOptionGroup = (groupName: string) => {
        setOptionGroups(prev => prev.filter(g => g.name !== groupName))
    }

    const generateCombinations = (groups: { name: string; values: string[] }[]) => {
        let combos: { name: string; value: string }[][] = [[]]
        for (const group of groups) {
            const next: { name: string; value: string }[][] = []
            for (const combo of combos) {
                for (const v of group.values) {
                    next.push([...combo, { name: group.name, value: v }])
                }
            }
            combos = next
        }
        const res = combos.map((options, idx) => ({
            sku: `${formData.name.replace(/\s+/g, '-').toUpperCase()}-${idx + 1}`,
            options,
            price: Number(formData.price) || undefined,
            stock: Number(formData.stock) || undefined,
        }))
        setVariants(res)
    }

    const handleVariantChange = (index: number, patch: Partial<Variant>) => {
        setVariants(prev => prev.map((v, i) => i === index ? { ...v, ...patch } : v))
    }

    const handleVariantImageUpload = async (index: number, file: File) => {
        const { data } = await uploadFile({ variables: { file } })
        const url = data?.uploadImage?.url as string | undefined
        if (url) handleVariantChange(index, { image_url: url })
    }

    const handleSave = async () => {
        const variables = {
            name: formData.name,
            price: Number(formData.price),
            currency: 'USD',
            product_overview: formData.description,
            category_id: formData.category || undefined,
            is_returnable: true,
            images: [],
            specifications,
            options: optionGroups.map(g => ({ name: g.name, values: g.values })),
            variants: variants.map(v => ({ sku: v.sku, options: v.options, price: typeof v.price === 'number' ? v.price : undefined, stock: typeof v.stock === 'number' ? v.stock : undefined, image_url: v.image_url || undefined })),
        }
        await createProductWithVariants({ variables })
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

                            {/* Specifications */}
                            <div className="space-y-2">
                                <Label>Specifications</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    <Input placeholder="Name (e.g. Material)" value={specName} onChange={(e) => setSpecName(e.target.value)} />
                                    <Input placeholder="Value (e.g. Cotton)" value={specValue} onChange={(e) => setSpecValue(e.target.value)} />
                                </div>
                                <div className="flex gap-2">
                                    <Button size="sm" onClick={addSpecification}><Plus className="h-4 w-4" /></Button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {specifications.map((s, i) => (
                                        <Badge key={`${s.spec_name}-${i}`} variant="secondary" className="gap-1">
                                            {s.spec_name}: {s.spec_value}
                                            <button onClick={() => removeSpecification(i)} className="ml-1 hover:text-destructive">
                                                <X className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            {/* Option Groups */}
                            <div className="space-y-2">
                                <Label>Options</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    <Input placeholder="Option Name (e.g. Color)" value={optionGroupName} onChange={(e) => setOptionGroupName(e.target.value)} />
                                    <Input placeholder="Add Value (e.g. Red)" value={optionValue} onChange={(e) => setOptionValue(e.target.value)} />
                                </div>
                                <div className="flex gap-2">
                                    <Button size="sm" onClick={addOptionGroup}><Plus className="h-4 w-4" /></Button>
                                    <Button size="sm" variant="outline" onClick={() => generateCombinations(optionGroups)}>Generate Variants</Button>
                                </div>
                                <div className="space-y-2">
                                    {optionGroups.map((g) => (
                                        <div key={g.name} className="flex items-center gap-2 flex-wrap">
                                            <Badge variant="outline">{g.name}</Badge>
                                            {g.values.map((v) => (
                                                <Badge key={v} variant="secondary" className="gap-1">
                                                    {v}
                                                    <button onClick={() => removeOptionValue(g.name, v)} className="ml-1 hover:text-destructive">
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </Badge>
                                            ))}
                                            <Button size="xs" variant="ghost" onClick={() => removeOptionGroup(g.name)}>Remove</Button>
                                        </div>
                                    ))}
                                </div>
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
                                <Button onClick={handleSave} className="flex-1" disabled={isSaving}>
                                    <Save className="h-4 w-4 mr-2" />
                                    {isSaving ? 'Saving...' : 'Save Changes'}
                                </Button>
                                <Button variant="outline" onClick={onClose}>
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </div>
                    {/* Variants Table */}
                    {variants.length > 0 && (
                        <div className="mt-8 space-y-4">
                            <Label>Generated Variants</Label>
                            <div className="grid grid-cols-1 gap-2">
                                {variants.map((v, i) => (
                                    <div key={i} className="grid grid-cols-6 gap-2 items-center">
                                        <Input value={v.sku} onChange={(e) => handleVariantChange(i, { sku: e.target.value })} />
                                        <Input type="number" placeholder="Price" value={v.price ?? ''} onChange={(e) => handleVariantChange(i, { price: e.target.value === '' ? undefined : Number(e.target.value) })} />
                                        <Input type="number" placeholder="Stock" value={v.stock ?? ''} onChange={(e) => handleVariantChange(i, { stock: e.target.value === '' ? undefined : Number(e.target.value) })} />
                                        <Input placeholder="Image URL" value={v.image_url ?? ''} onChange={(e) => handleVariantChange(i, { image_url: e.target.value })} />
                                        <div className="flex items-center gap-2">
                                            <input type="file" accept="image/*" onChange={(e) => e.target.files && handleVariantImageUpload(i, e.target.files[0])} />
                                        </div>
                                        <div className="text-sm text-muted-foreground col-span-6">
                                            {v.options.map((o) => `${o.name}: ${o.value}`).join(' / ')}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </div>
        </div>
    )
}