import { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { Save, X, Plus, Loader2, ImageIcon } from 'lucide-react'
import { UPDATE_PRODUCT } from '@/graphql/product'
import { UPLOAD_FILE } from '@/graphql/upload-file'
import { Dropzone } from '@/components/ui/dropzone'
import type { ProductType, ProductImage, ProductSpecification } from '@/types'

interface ProductDetailsFormProps {
    product: ProductType
    onUpdate?: (product: ProductType) => void
}

export function ProductDetailsForm({ product, onUpdate }: ProductDetailsFormProps) {
    const [formData, setFormData] = useState({
        name: product.name || '',
        price: product.price || 0,
        currency: product.currency || 'USD',
        stock: product.stock || 0,
        product_overview: product.product_overview || '',
        is_returnable: product.is_returnable || false,
        is_public: product.is_public || false
    })

    const [images, setImages] = useState<ProductImage[]>(product.images || [])
    const [specifications, setSpecifications] = useState<ProductSpecification[]>(product.productSpecifications || [])
    const [newSpec, setNewSpec] = useState({ spec_name: '', spec_value: '' })
    const [uploading, setUploading] = useState(false)
    const [saving, setSaving] = useState(false)

    const [updateProduct] = useMutation(UPDATE_PRODUCT)
    const [uploadFile] = useMutation(UPLOAD_FILE)

    useEffect(() => {
        // Ensure currency is always a valid 3-4 character code
        const validCurrency = product.currency && product.currency.length >= 3
            ? product.currency
            : 'USD'

        setFormData({
            name: product.name || '',
            price: product.price || 0,
            currency: validCurrency,
            stock: product.stock || 0,
            product_overview: product.product_overview || '',
            is_returnable: product.is_returnable || false,
            is_public: product.is_public || false
        })
        setImages(product.images || [])
        setSpecifications(product.productSpecifications || [])
    }, [product])

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleImageUpload = async (files: File[]) => {
        if (images.length + files.length > 4) {
            toast.error('Maximum 4 images allowed')
            return
        }

        setUploading(true)
        try {
            const uploadPromises = files.map(async (file) => {
                const { data } = await uploadFile({ variables: { file } })
                return {
                    id: Date.now().toString(),
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
            setUploading(false)
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
        if (newSpec.spec_name && newSpec.spec_value) {
            const newSpecification: ProductSpecification = {
                id: Date.now().toString(),
                product_id: product.id,
                spec_name: newSpec.spec_name,
                spec_value: newSpec.spec_value
            }
            setSpecifications(prev => [...prev, newSpecification])
            setNewSpec({ spec_name: '', spec_value: '' })
        }
    }

    const removeSpecification = (specId: string) => {
        setSpecifications(prev => prev.filter(spec => spec.id !== specId))
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            const { data } = await updateProduct({
                variables: {
                    id: product.id,
                    ...formData,
                    images: images.map(img => ({
                        image_url: img.image_url,
                        is_primary: img.is_primary
                    })),
                    productSpecifications: specifications.map(spec => ({
                        spec_name: spec.spec_name,
                        spec_value: spec.spec_value
                    }))
                }
            })

            if (data?.updateProduct?.success) {
                toast.success('Product updated successfully!')
                onUpdate?.(data.updateProduct.product)
            } else {
                toast.error(data?.updateProduct?.message || 'Failed to update product')
            }
        } catch (error) {
            console.error('Error updating product:', error)
            toast.error('An error occurred while updating the product')
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="space-y-6 bg-gray-50 p-4 rounded-lg border">
            {/* Product Header */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary">PSKU: {product.psku}</Badge>
                        {product.category_name && (
                            <Badge variant="secondary">{product.category_name}</Badge>
                        )}
                        {product.brand_name && (
                            <Badge variant="secondary">{product.brand_name}</Badge>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    {/* Visibility Toggle - Prominent placement */}
                    <div className="flex items-center gap-3 px-4 py-2 bg-white border rounded-lg">
                        <Switch
                            checked={formData.is_public}
                            onChange={(e) => handleInputChange('is_public', e.target.checked)}
                            name="is_public"
                        />
                        <span className="text-sm font-medium">
                            {formData.is_public ? (
                                <span className="text-green-600">Public (Visible to customers)</span>
                            ) : (
                                <span className="text-orange-600">Private (Dashboard only)</span>
                            )}
                        </span>
                    </div>
                    <Button onClick={handleSave} disabled={saving}>
                        {saving ? (
                            <>
                                <Save className="h-4 w-4 mr-2 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4 mr-2" />
                                Save Changes
                            </>
                        )}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Information */}
                    <div className="border rounded-lg p-6">
                        <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium mb-1">Product Name</label>
                                <input
                                    id="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    placeholder="Enter product name"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label htmlFor="price" className="block text-sm font-medium mb-1">Price</label>
                                    <input
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                                        placeholder="0.00"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="currency" className="block text-sm font-medium mb-1">Currency</label>
                                    <select
                                        id="currency"
                                        value={formData.currency}
                                        onChange={(e) => handleInputChange('currency', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="USD">USD - US Dollar</option>
                                        <option value="EUR">EUR - Euro</option>
                                        <option value="GBP">GBP - British Pound</option>
                                        <option value="AED">AED - UAE Dirham</option>
                                        <option value="EGP">EGP - Egyptian Pound</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="stock" className="block text-sm font-medium mb-1">Stock</label>
                                    <input
                                        id="stock"
                                        type="number"
                                        value={formData.stock}
                                        onChange={(e) => handleInputChange('stock', parseInt(e.target.value))}
                                        placeholder="0"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="overview" className="block text-sm font-medium mb-1">Product Overview</label>
                                <textarea
                                    id="overview"
                                    value={formData.product_overview}
                                    onChange={(e) => handleInputChange('product_overview', e.target.value)}
                                    placeholder="Describe your product..."
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Product Settings */}
                            <div className="pt-4 border-t">
                                <h4 className="text-sm font-medium mb-3 text-gray-700">Product Settings</h4>
                                <div className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-lg">
                                    <Switch
                                        checked={formData.is_returnable}
                                        onChange={(e) => handleInputChange('is_returnable', e.target.checked)}
                                        name="is_returnable"
                                    />
                                    <span className="text-sm">This product is returnable</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product Images */}
                    <div className="border rounded-lg p-6">
                        <h3 className="text-lg font-semibold mb-4">Product Images (Max 4)</h3>
                        {/* Image Upload */}
                        {images.length < 4 && (
                            <div className="space-y-2">
                                <Dropzone
                                    onFilesDrop={handleImageUpload}
                                    accept="image/*"
                                    multiple={true}
                                    className="h-32"
                                />
                                {uploading && (
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Uploading images...
                                    </div>
                                )}
                            </div>
                        )}

                        {images.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
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
                </div>

                {/* Product Specifications */}
                <div className="border rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Product Specifications</h3>
                    <div className="space-y-4">
                        {/* Add New Specification */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            <input
                                type="text"
                                placeholder="Specification name"
                                value={newSpec.spec_name}
                                onChange={(e) => setNewSpec(prev => ({ ...prev, spec_name: e.target.value }))}
                                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="text"
                                placeholder="Specification value"
                                value={newSpec.spec_value}
                                onChange={(e) => setNewSpec(prev => ({ ...prev, spec_value: e.target.value }))}
                                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <Button onClick={addSpecification} disabled={!newSpec.spec_name || !newSpec.spec_value}>
                                <Plus className="h-4 w-4 mr-2" />
                                Add
                            </Button>
                        </div>

                        {/* Specifications List */}
                        <div className="space-y-2">
                            {specifications.map((spec) => (
                                <div key={spec.id} className="flex items-center justify-between p-3 border rounded-lg">
                                    <div className="flex-1">
                                        <span className="font-medium">{spec.spec_name}:</span>
                                        <span className="ml-2 text-muted-foreground">{spec.spec_value}</span>
                                    </div>
                                    <Button
                                        className="h-8 px-3 text-sm bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        onClick={() => removeSpecification(spec.id || '')}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Sidebar - Product Info */}
            <div className="space-y-6">
                <div className="border rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Product Information</h3>
                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium mb-1">PSKU</label>
                            <p className="text-sm text-muted-foreground font-mono">{product.psku}</p>
                        </div>

                        {product.category_name && (
                            <div>
                                <label className="block text-sm font-medium mb-1">Category</label>
                                <p className="text-sm text-muted-foreground">{product.category_name}</p>
                            </div>
                        )}

                        {product.subcategory_name && (
                            <div>
                                <label className="block text-sm font-medium mb-1">Subcategory</label>
                                <p className="text-sm text-muted-foreground">{product.subcategory_name}</p>
                            </div>
                        )}

                        {product.brand_name && (
                            <div>
                                <label className="block text-sm font-medium mb-1">Brand</label>
                                <p className="text-sm text-muted-foreground">{product.brand_name}</p>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium mb-1">Created</label>
                            <p className="text-sm text-muted-foreground">
                                {product.created_at ? new Date(product.created_at).toLocaleDateString() : 'N/A'}
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Last Updated</label>
                            <p className="text-sm text-muted-foreground">
                                {product.updated_at ? new Date(product.updated_at).toLocaleDateString() : 'N/A'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}