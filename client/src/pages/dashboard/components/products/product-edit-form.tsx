import { useState, useEffect } from "react"

import {
    Edit,
    Save,
    X,
    Loader2,
    AlertCircle,
    Plus,
    Trash2,
    Image as ImageIcon,
    Package,
    DollarSign,
    Tag,
    Layers
} from "lucide-react"
import { CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Badge } from "../ui/badge"
import { useMutation, useQuery } from "@apollo/client"
import { GET_PRODUCT, UPDATE_PRODUCT } from "@/graphql/product"
import { UPLOAD_FILE } from "@/graphql/upload-file"
import { toast } from "sonner"
import { Dropzone } from "@/components/ui/dropzone"

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
        is_public: false,
        product_overview: ""
    })

    const [images, setImages] = useState<Array<{ id?: string, image_url: string, is_primary?: boolean }>>([])
    const [specifications, setSpecifications] = useState<Array<{ id?: string, spec_name: string, spec_value: string }>>([])
    const [options, setOptions] = useState<Array<{ id?: string, name: string, value: string, type?: string, image_url?: string }>>([])
    const [variants, setVariants] = useState<Array<{ id?: string, sku: string, option_combination?: string, price?: number, stock?: number, image_url?: string }>>([])
    const [newSpec, setNewSpec] = useState({ name: "", value: "" })
    const [newOption, setNewOption] = useState({ name: "", value: "", type: "text", image_url: "" })
    const [uploadingImages, setUploadingImages] = useState(false)
    // Update form data when product loads
    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || "",
                price: product.price?.toString() || "",
                category_id: product.category_id || "",
                currency: product.currency || "USD",
                is_returnable: product.is_returnable || false,
                is_public: product.is_public || false,
                product_overview: product.product_overview || ""
            })
            setImages(product.images || [])
            setSpecifications(product.productSpecifications || [])
            setOptions(product.productOptions || [])
            setVariants(product.variants || [])
        }
    }, [product])

    const [uploadFile] = useMutation(UPLOAD_FILE)

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

    const handleImageUpload = async (files: File[]) => {
        if (images.length + files.length > 4) {
            toast.error('Maximum 4 images allowed')
            return
        }

        setUploadingImages(true)
        try {
            const uploadPromises = files.map(async (file) => {
                const { data } = await uploadFile({ variables: { file } })
                return {
                    image_url: data.uploadImage.url,
                    is_primary: images.length === 0 // First image is primary
                }
            })

            const uploadedImages = await Promise.all(uploadPromises)
            setImages(prev => [...prev, ...uploadedImages])
            toast.success(`${files.length} image(s) uploaded successfully`)
        } catch (error) {
            console.error(error)
            toast.error('Failed to upload images')
        } finally {
            setUploadingImages(false)
        }
    }

    const removeImage = (index: number) => {
        setImages(prev => {
            const newImages = prev.filter((_, i) => i !== index)
            // If we removed the primary image, make the first remaining image primary
            if (prev[index]?.is_primary && newImages.length > 0) {
                newImages[0].is_primary = true
            }
            return newImages
        })
    }

    const setPrimaryImage = (index: number) => {
        setImages(prev => prev.map((img, i) => ({
            ...img,
            is_primary: i === index
        })))
    }

    const addSpecification = () => {
        if (!newSpec.name.trim() || !newSpec.value.trim()) {
            toast.error('Please fill in both specification name and value')
            return
        }
        setSpecifications(prev => [...prev, { spec_name: newSpec.name.trim(), spec_value: newSpec.value.trim() }])
        setNewSpec({ name: "", value: "" })
    }

    const removeSpecification = (index: number) => {
        setSpecifications(prev => prev.filter((_, i) => i !== index))
    }

    const addOption = () => {
        if (!newOption.name.trim() || !newOption.value.trim()) {
            toast.error('Please fill in both option name and value')
            return
        }
        setOptions(prev => [...prev, { name: newOption.name.trim(), value: newOption.value.trim(), type: newOption.type, image_url: newOption.image_url }])
        setNewOption({ name: "", value: "", type: "text", image_url: "" })
    }

    const removeOption = (index: number) => {
        setOptions(prev => prev.filter((_, i) => i !== index))
    }

    const addVariant = () => {
        const newVariant = {
            sku: `${formData.name.replace(/\s+/g, '-').toUpperCase()}-${variants.length + 1}`,
            option_combination: '',
            price: parseFloat(formData.price) || 0,
            stock: 0,
            image_url: ''
        }
        setVariants(prev => [...prev, newVariant])
    }

    const updateVariant = (index: number, field: string, value: any) => {
        setVariants(prev => prev.map((variant, i) =>
            i === index ? { ...variant, [field]: value } : variant
        ))
    }

    // Helper function to convert simple text to JSON format
    const convertToJsonFormat = (index: number) => {
        const variant = variants[index]
        const text = variant.option_combination || ''

        // If it's already JSON, don't convert
        if (text.trim().startsWith('[') || text.trim().startsWith('{')) {
            return
        }

        // Convert simple text like "Color: Red, Size: Large" to JSON
        try {
            const pairs = text.split(',').map(pair => pair.trim())
            const jsonArray = pairs.map(pair => {
                const [name, value] = pair.split(':').map(s => s.trim())
                return { name: name || '', value: value || '' }
            }).filter(item => item.name && item.value)

            const jsonString = JSON.stringify(jsonArray)
            updateVariant(index, 'option_combination', jsonString)
            toast.success('Converted to JSON format')
        } catch (error) {
            console.error(error)
            toast.error('Failed to convert to JSON format')
        }
    }

    const removeVariant = (index: number) => {
        setVariants(prev => prev.filter((_, i) => i !== index))
    }

    const handleVariantImageUpload = async (index: number, file: File) => {
        try {
            const { data } = await uploadFile({ variables: { file } })
            const url = data?.uploadImage?.url
            if (url) {
                updateVariant(index, 'image_url', url)
                toast.success('Variant image uploaded successfully')
            }
        } catch (error) {
            console.error(error)
            toast.error('Failed to upload variant image')
        }
    }

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
                    is_public: formData.is_public,
                    product_overview: formData.product_overview,
                    images: images.map(img => ({
                        image_url: img.image_url,
                        is_primary: img.is_primary || false
                    })),
                    productSpecifications: specifications.map(spec => ({
                        spec_name: spec.spec_name,
                        spec_value: spec.spec_value
                    })),
                    productOptions: options.map(opt => ({
                        name: opt.name,
                        value: opt.value,
                        type: opt.type || 'text',
                        image_url: opt.image_url || null
                    })),
                    variants: variants.map(variant => {
                        let options = []
                        try {
                            if (typeof variant.option_combination === 'string') {
                                // Only try to parse if it looks like JSON (starts with [ or {)
                                if (variant.option_combination.trim().startsWith('[') || variant.option_combination.trim().startsWith('{')) {
                                    options = JSON.parse(variant.option_combination)
                                } else {
                                    // If it's a simple string, treat it as a single option value
                                    console.warn('Invalid JSON format for option_combination:', variant.option_combination)
                                    options = []
                                }
                            } else if (Array.isArray(variant.option_combination)) {
                                options = variant.option_combination
                            }
                        } catch (error) {
                            console.error('Failed to parse option_combination:', variant.option_combination, error)
                            options = []
                        }

                        return {
                            id: variant.id,
                            sku: variant.sku,
                            options: options,
                            price: variant.price,
                            stock: variant.stock,
                            image_url: variant.image_url
                        }
                    })
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
            <div className="bg-background rounded-lg shadow-elevated max-w-4xl w-full max-h-[90vh] overflow-y-auto p-2">
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

                <CardContent className="p-6 max-h-[80vh] overflow-y-auto">
                    <div className="space-y-8">
                        {/* Product Images */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <ImageIcon className="h-5 w-5 text-primary" />
                                <h3 className="text-lg font-semibold">Product Images (Max 4)</h3>
                            </div>

                            {images.length < 4 && (
                                <div className="space-y-2">
                                    <Dropzone
                                        onFilesDrop={handleImageUpload}
                                        accept="image/*"
                                        multiple={true}
                                        className="h-32"
                                    />
                                    {uploadingImages && (
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Uploading images...
                                        </div>
                                    )}
                                </div>
                            )}

                            {images.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {images.map((image, index) => (
                                        <div key={index} className="relative group">
                                            <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                                                <img
                                                    src={image.image_url}
                                                    alt={`Product ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="absolute top-2 right-2 flex gap-1">
                                                {!image.is_primary && (
                                                    <Button
                                                        size="sm"
                                                        variant="secondary"
                                                        className="h-6 w-6 p-0"
                                                        onClick={() => setPrimaryImage(index)}
                                                        title="Set as primary"
                                                    >
                                                        <ImageIcon className="h-3 w-3" />
                                                    </Button>
                                                )}
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    className="h-6 w-6 p-0"
                                                    onClick={() => removeImage(index)}
                                                    title="Remove image"
                                                >
                                                    <X className="h-3 w-3" />
                                                </Button>
                                            </div>
                                            {image.is_primary && (
                                                <Badge className="absolute bottom-2 left-2 text-xs">Primary</Badge>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Basic Information */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Package className="h-5 w-5 text-primary" />
                                <h3 className="text-lg font-semibold">Basic Information</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="name">Product Name *</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                        placeholder="Enter product name"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="currency">Currency *</Label>
                                    <Select value={formData.currency} onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="USD">USD - US Dollar</SelectItem>
                                            <SelectItem value="EUR">EUR - Euro</SelectItem>
                                            <SelectItem value="GBP">GBP - British Pound</SelectItem>
                                            <SelectItem value="AED">AED - UAE Dirham</SelectItem>
                                            <SelectItem value="EGP">EGP - Egyptian Pound</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="price">Price *</Label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="price"
                                            type="number"
                                            step="0.01"
                                            value={formData.price}
                                            onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                                            placeholder="0.00"
                                            className="pl-10"
                                            required
                                        />
                                    </div>
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
                            </div>

                            <div>
                                <Label htmlFor="product_overview">Product Overview</Label>
                                <Textarea
                                    id="product_overview"
                                    value={formData.product_overview}
                                    onChange={(e) => setFormData(prev => ({ ...prev, product_overview: e.target.value }))}
                                    rows={4}
                                    placeholder="Enter detailed product description..."
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

                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="is_public"
                                    checked={formData.is_public}
                                    onChange={(e) => setFormData(prev => ({ ...prev, is_public: e.target.checked }))}
                                    className="rounded border-gray-300"
                                />
                                <Label htmlFor="is_public">Product is public (visible to customers)</Label>
                            </div>
                        </div>


                        {/* Specifications */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Tag className="h-5 w-5 text-primary" />
                                <h3 className="text-lg font-semibold">Specifications</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                <Input
                                    placeholder="Specification name"
                                    value={newSpec.name}
                                    onChange={(e) => setNewSpec(prev => ({ ...prev, name: e.target.value }))}
                                />
                                <Input
                                    placeholder="Specification value"
                                    value={newSpec.value}
                                    onChange={(e) => setNewSpec(prev => ({ ...prev, value: e.target.value }))}
                                />
                                <Button onClick={addSpecification} className="w-full md:w-auto">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Spec
                                </Button>
                            </div>

                            {specifications.length > 0 && (
                                <div className="space-y-2">
                                    {specifications.map((spec, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                            <span className="text-sm">
                                                <strong>{spec.spec_name}:</strong> {spec.spec_value}
                                            </span>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => removeSpecification(index)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Options */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Layers className="h-5 w-5 text-primary" />
                                <h3 className="text-lg font-semibold">Product Options</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                <Input
                                    placeholder="Option name"
                                    value={newOption.name}
                                    onChange={(e) => setNewOption(prev => ({ ...prev, name: e.target.value }))}
                                />
                                <Input
                                    placeholder="Option value"
                                    value={newOption.value}
                                    onChange={(e) => setNewOption(prev => ({ ...prev, value: e.target.value }))}
                                />
                                <Button onClick={addOption} className="w-full md:w-auto">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Option
                                </Button>
                            </div>

                            {options.length > 0 && (
                                <div className="space-y-2">
                                    {options.map((option, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                            <span className="text-sm">
                                                <Badge variant="outline" className="mr-2">{option.type}</Badge>
                                                <strong>{option.name}:</strong> {option.value}
                                            </span>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => removeOption(index)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Variants */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Package className="h-5 w-5 text-primary" />
                                    <h3 className="text-lg font-semibold">Product Variants</h3>
                                </div>
                                <Button onClick={addVariant} size="sm">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Variant
                                </Button>
                            </div>

                            {variants.length > 0 && (
                                <div className="space-y-4">
                                    {variants.map((variant, index) => (
                                        <div key={index} className="p-4 border rounded-lg space-y-3">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-medium">Variant {index + 1}</h4>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => removeVariant(index)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                                <div>
                                                    <Label className="text-xs">SKU *</Label>
                                                    <Input
                                                        value={variant.sku}
                                                        onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                                                        placeholder="Enter SKU"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <Label className="text-xs">Price ({formData.currency})</Label>
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        value={variant.price || ''}
                                                        onChange={(e) => updateVariant(index, 'price', parseFloat(e.target.value) || undefined)}
                                                        placeholder="0.00"
                                                    />
                                                </div>
                                                <div>
                                                    <Label className="text-xs">Stock Quantity</Label>
                                                    <Input
                                                        type="number"
                                                        value={variant.stock || ''}
                                                        onChange={(e) => updateVariant(index, 'stock', parseInt(e.target.value) || undefined)}
                                                        placeholder="0"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <Label className="text-xs">Option Combination</Label>
                                                <div className="flex gap-2">
                                                    <Input
                                                        value={variant.option_combination || ''}
                                                        onChange={(e) => updateVariant(index, 'option_combination', e.target.value)}
                                                        placeholder='JSON format: [{"name":"Color","value":"Red"}] or Color: Red, Size: Large'
                                                        className="flex-1"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => convertToJsonFormat(index)}
                                                        className="whitespace-nowrap"
                                                    >
                                                        Convert
                                                    </Button>
                                                </div>
                                                <p className="text-xs text-gray-500">
                                                    Enter as "Name: Value, Name: Value" and click Convert, or enter JSON directly
                                                </p>
                                            </div>

                                            <div className="space-y-3">
                                                <Label className="text-xs">Variant Image</Label>
                                                <div className="flex gap-3">
                                                    <div className="flex-1">
                                                        <Input
                                                            value={variant.image_url || ''}
                                                            onChange={(e) => updateVariant(index, 'image_url', e.target.value)}
                                                            placeholder="Enter image URL or upload below"
                                                        />
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) => e.target.files && handleVariantImageUpload(index, e.target.files[0])}
                                                            className="hidden"
                                                            id={`edit-variant-image-${index}`}
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => document.getElementById(`edit-variant-image-${index}`)?.click()}
                                                        >
                                                            <ImageIcon className="h-4 w-4 mr-1" />
                                                            Upload
                                                        </Button>
                                                    </div>
                                                </div>
                                                {variant.image_url && (
                                                    <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden">
                                                        <img
                                                            src={variant.image_url}
                                                            alt={`Variant ${index + 1}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>


                        {/* Save Actions */}
                        <div className="flex gap-3 pt-4 border-t">
                            <Button
                                onClick={handleSave}
                                className="flex-1"
                                disabled={updating || uploadingImages}
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